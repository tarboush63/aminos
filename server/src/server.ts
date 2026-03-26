// server/src/server.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { validatePromoForOrder } from "./promos";


dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "*";
const SALES_EMAIL = process.env.SALES_EMAIL;

// rate limiter for promo checks
const promoLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many promo checks, slow down." },
});




if (!SALES_EMAIL) throw new Error("SALES_EMAIL is not configured");

// SendGrid setup
if (!process.env.SENDGRID_API_KEY) {
  console.warn("WARNING: SENDGRID_API_KEY not set — outbound email will fail if USE_SENDGRID=true");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const app = express();
const allowedOrigins = [
  "https://aminospep.com",
  "https://www.aminospep.com",
  "http://localhost:8080" // dev, if needed
];

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust first proxy (Render)
app.set("trust proxy", 1);

// Rate limiter for orders
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // adjust per needs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many orders from this IP, please wait." },
});

const escapeHtml = (str: string | undefined): string => {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return match;
    }
  });
};

const safeHtml = (str?: string) => escapeHtml(str || "");

// ---------- Bankful Payment integration utilities ----------

const BANKFUL_SIGN_SECRET = process.env.BANKFUL_SIGN_SECRET || "bankful-secret-sandbox";
const BANKFUL_MERCHANT_ID = process.env.BANKFUL_MERCHANT_ID || "demo_merchant";
const BANKFUL_HOSTED_URL = "https://api-dev1.bankfulportal.com/front-calls/go-in/hosted-page-pay";

const processedBankfulOrderIds = new Set<string>();
const bankfulOrderStatus: Record<string, "paid" | "pending" | "failed"> = {};

function generateBankfulSignature(payload: Record<string, unknown>, secret: string): string {
  const keys = Object.keys(payload)
    .filter(k => payload[k] !== undefined && payload[k] !== null && k !== "signature")
    .sort();

  const stringToSign = keys
    .map(key => `${key}=${String(payload[key])}`)
    .join("");

  return crypto.createHmac("sha256", secret).update(stringToSign).digest("hex");
}

// API: create order
app.post("/api/orders", orderLimiter, async (req: Request, res: Response) => {
  try {
 const { customer, items, total, promoCode } = req.body as { customer?: any; items?: any[]; total?: number; promoCode?: string };

    // Basic validation
    if (!customer || !customer.name || !customer.email || !customer.address) {
      return res.status(400).json({ success: false, message: "Missing required customer fields" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (typeof total !== "number" || total <= 0) {
      return res.status(400).json({ success: false, message: "Invalid total" });
    }

        let promoHtml = "";
    if (promoCode) {
      const promoValidation = validatePromoForOrder(promoCode, total, items.length ? (items[0].currency ?? "usd") : "usd");
      if (!promoValidation.valid) {
        return res.status(400).json({ success: false, message: `Promo invalid: ${promoValidation.reason}` });
      }
      const discountAmount = promoValidation.discountAmount ?? 0;
      const finalTotal = Math.round((total - discountAmount) * 100) / 100;
      promoHtml = `<p>Applied promo <strong>${escapeHtml(promoCode)}</strong> - Discount: $${Number(discountAmount).toFixed(2)} — New total: $${Number(finalTotal).toFixed(2)}</p>`;
    }

    // Build HTML for items
    const cartItemsHtml = items.map((item: any) => `
      <li>${item.quantity} x ${safeHtml(item.name)} - $${Number(item.price).toFixed(2)}</li>
    `).join("");


    const html = `
      <h2>New Order Received</h2>
      <h3>Customer Details</h3>
      <p>Name: ${safeHtml(customer.name)}</p>
      <p>Email: ${safeHtml(customer.email)}</p>
      ${customer.phone ? `<p>Phone: ${safeHtml(customer.phone)}</p>` : ""}
      <p>Address: ${safeHtml(customer.address)}</p>
      ${customer.company ? `<p>Company: ${safeHtml(customer.company)}</p>` : ""}
      ${customer.notes ? `<p>Notes: ${safeHtml(customer.notes)}</p>` : ""}
      <h3>Order Items</h3>
      <ul>${cartItemsHtml}</ul>
      <p><strong>Total: $${Number(total).toFixed(2)}</strong></p>
      <p>Received at: ${new Date().toISOString()}</p>
      <p>${promoHtml}</p>
    `;


    // Use SendGrid if configured and requested
    const useSendGrid = process.env.USE_SENDGRID === "true" || !!process.env.SENDGRID_API_KEY;

    if (useSendGrid) {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error("SENDGRID_API_KEY is not set in environment");
      }

      const msg = {
        to: SALES_EMAIL!,
        from: process.env.SENDGRID_FROM_EMAIL!, // must be verified or within authenticated domain
        subject: `New Order from ${safeHtml(customer.name)}`,
        html,
      };

      try {
        const response = await sgMail.send(msg);
        // log useful info for tracing
        console.log("SendGrid response status:", response?.[0]?.statusCode);
        console.log("SendGrid headers:", response?.[0]?.headers);
      } catch (sendErr: any) {
        console.error("Order email error (SendGrid):", sendErr?.response?.body || sendErr);
        return res.status(500).json({ success: false, message: "Failed to send order email" });
      }
    } else {
      // Fallback: no SendGrid; you can implement Nodemailer fallback here if desired.
      console.warn("SendGrid not configured and fallback disabled. Order will be accepted but no email sent.");
    }

    res.status(200).json({ success: true, message: "Order received. Our sales team will contact you shortly." });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ success: false, message: "Failed to process order" });
  }
});

// ---------- Bankful hosted page creation endpoint ----------
app.post("/api/bankful/create", orderLimiter, (req: Request, res: Response) => {
  try {
    const { order_id, amount, currency, email, customer_name } = req.body as {
      order_id?: string;
      amount?: number;
      currency?: string;
      email?: string;
      customer_name?: string;
    };

    if (!order_id || !amount || !currency || !email) {
      return res.status(400).json({ success: false, message: "Missing required bankful parameters" });
    }

    const payload: Record<string, unknown> = {
      merchant_id: BANKFUL_MERCHANT_ID,
      order_id: String(order_id),
      amount: Number(amount).toFixed(2),
      currency: String(currency).toUpperCase(),
      email: String(email),
      customer_name: customer_name ? String(customer_name) : "",
      return_url: `${process.env.BASE_URL || `http://localhost:${PORT}`}/success`,
      callback_url: `${process.env.BASE_URL || `http://localhost:${PORT}`}/callback`,
    };

    const signature = generateBankfulSignature(payload, BANKFUL_SIGN_SECRET);
    payload.signature = signature;

    // auto-submitting HTML form (POST redirect to Bankful)
    const html = `<!DOCTYPE html>
<html><head><title>Redirecting to Bankful</title></head><body>
  <form id="bankful-form" method="POST" action="${BANKFUL_HOSTED_URL}">
    ${Object.entries(payload)
      .map(([key, value]) => `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(String(value))}"/>`)
      .join("\n    ")}
  </form>
  <script>document.getElementById('bankful-form').submit();</script>
  <noscript>Please submit this form <button type="submit" form="bankful-form">here</button>.</noscript>
</body></html>`;

    return res.status(200).send(html);
  } catch (err) {
    console.error("Bankful create error:", err);
    return res.status(500).json({ success: false, message: "Failed to create bankful payment" });
  }
});

// Callback endpoint from Bankful (webhook)
app.post("/callback", (req: Request, res: Response) => {
  try {
    const payload = req.body as Record<string, string>;

    const { order_id, status, signature } = payload;
    if (!order_id || !status || !signature) {
      return res.status(400).json({ success: false, message: "Missing callback fields" });
    }

    const computedSignature = generateBankfulSignature(payload, BANKFUL_SIGN_SECRET);
    if (computedSignature !== signature) {
      console.warn("Bankful callback signature mismatch", { order_id });
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    if (processedBankfulOrderIds.has(order_id)) {
      console.warn("Duplicate callback received", { order_id });
      return res.status(409).json({ success: false, message: "Duplicate callback" });
    }

    processedBankfulOrderIds.add(order_id);

    if (status.toLowerCase() === "success" || status.toLowerCase() === "paid") {
      bankfulOrderStatus[order_id] = "paid";
    } else {
      bankfulOrderStatus[order_id] = "failed";
    }

    // Callback should only mark paid; success page is separate.
    return res.status(200).json({ success: true, message: "Callback accepted" });
  } catch (err) {
    console.error("Callback error:", err);
    return res.status(500).json({ success: false, message: "Callback processing failed" });
  }
});

// Return URL after customer completes hosted page (non-authoritative, no state change)
app.get("/success", (_req, res) => {
  res.send("Payment complete in gateway. Final settlement is confirmed via callback.");
});

app.post("/api/promos/validate", promoLimiter, (req: Request, res: Response) => {
  try {
    const { code, total, currency } = req.body as { code?: string; total?: number; currency?: string };
    if (!code) return res.status(400).json({ success: false, message: "Missing code" });
    const t = typeof total === "number" ? total : 0;
    const result = validatePromoForOrder(code, t, currency);
    if (!result.valid) return res.status(400).json({ success: false, message: result.reason || "Invalid promo" });
    return res.status(200).json({
      success: true,
      promo: {
        code: result.promo!.code,
        type: result.promo!.type,
        amount: result.promo!.amount,
        description: result.promo!.description,
      },
      discountAmount: result.discountAmount,
      newTotal: result.newTotal,
      freeShipping: result.freeShipping || false,
    });
  } catch (err) {
    console.error("Promo validate error:", err);
    return res.status(500).json({ success: false, message: "Failed to validate promo" });
  }
});

app.get("/", (_req, res) => res.send("Server running"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
