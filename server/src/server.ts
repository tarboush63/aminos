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

const sendSalesEmail = async (subject: string, html: string) => {
  const useSendGrid = process.env.USE_SENDGRID === "true" || !!process.env.SENDGRID_API_KEY;
  if (!useSendGrid) {
    console.warn("SendGrid not configured — skipping sales email.");
    return;
  }

  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not set in environment");
  }
  if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error("SENDGRID_FROM_EMAIL is not set in environment");
  }

  const msg = {
    to: SALES_EMAIL!,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject,
    html,
  };

  await sgMail.send(msg);
};

// ---------- Bankful Payment integration utilities ----------

const BANKFUL_SIGN_SECRET = process.env.BANKFUL_SIGN_SECRET || "bankful-secret-sandbox";
const BANKFUL_MERCHANT_ID = process.env.BANKFUL_MERCHANT_ID || "demo_merchant";
const BANKFUL_GATEWAY_USERNAME = process.env.BANKFUL_GATEWAY_USERNAME || BANKFUL_MERCHANT_ID;
const BANKFUL_HOSTED_URL = "https://api-dev1.bankfulportal.com/front-calls/go-in/hosted-page-pay";

const processedBankfulOrderIds = new Set<string>();
const bankfulOrderStatus: Record<string, "paid" | "pending" | "failed"> = {};

function generateBankfulSignature(payload: Record<string, unknown>, secret: string): string {
  const keys = Object.keys(payload)
    .filter(k => payload[k] !== undefined && payload[k] !== null && payload[k] !== "" && k !== "signature")
    .sort();

  const stringToSign = keys
    .map(key => `${key}${String(payload[key])}`)
    .join("");

  const signature = crypto.createHmac("sha256", secret).update(stringToSign).digest("hex");

  console.log("Bankful signature debug:");
  console.log("String to sign:", stringToSign);
  console.log("Signature:", signature);

  return signature;
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


    try {
      await sendSalesEmail(`New Order from ${safeHtml(customer.name)}`, html);
    } catch (sendErr: any) {
      console.error("Order email error (SendGrid):", sendErr?.response?.body || sendErr);
      return res.status(500).json({ success: false, message: "Failed to send order email" });
    }

    res.status(200).json({ success: true, message: "Order received. Our sales team will contact you shortly." });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ success: false, message: "Failed to process order" });
  }
});

// ---------- Bankful hosted page creation endpoint ----------
app.post("/api/bankful/create", orderLimiter, async (req: Request, res: Response) => {
  try {
    const {
      order_id,
      amount,
      request_currency,
      cust_fname,
      cust_lname,
      cust_email,
      cust_phone,
      bill_addr,
      bill_addr_2,
      bill_addr_city,
      bill_addr_state,
      bill_addr_zip,
      bill_addr_country,
      url_cancel,
      url_complete,
      url_failed,
      url_callback,
      url_pending,
      cart_name,
      return_redirect_url,
    } = req.body as {
      order_id?: string;
      amount?: number;
      request_currency?: string;
      cust_fname?: string;
      cust_lname?: string;
      cust_email?: string;
      cust_phone?: string;
      bill_addr?: string;
      bill_addr_2?: string;
      bill_addr_city?: string;
      bill_addr_state?: string;
      bill_addr_zip?: string;
      bill_addr_country?: string;
      url_cancel?: string;
      url_complete?: string;
      url_failed?: string;
      url_callback?: string;
      url_pending?: string;
      cart_name?: string;
      return_redirect_url?: string;
    };

    if (!order_id || !amount || !request_currency || !cust_email) {
      return res.status(400).json({ success: false, message: "Missing required bankful parameters (order_id, amount, request_currency, cust_email)" });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

    const payload: Record<string, unknown> = {
      req_username: BANKFUL_GATEWAY_USERNAME,
      transaction_type: "CAPTURE",
      amount: Number(amount).toFixed(2),
      request_currency: String(request_currency).toUpperCase(),
      cust_fname: cust_fname ? String(cust_fname) : undefined,
      cust_lname: cust_lname ? String(cust_lname) : undefined,
      cust_email: cust_email ? String(cust_email) : undefined,
      cust_phone: cust_phone ? String(cust_phone) : undefined,
      bill_addr: bill_addr ? String(bill_addr) : undefined,
      bill_addr_2: bill_addr_2 ? String(bill_addr_2) : undefined,
      bill_addr_city: bill_addr_city ? String(bill_addr_city) : undefined,
      bill_addr_state: bill_addr_state ? String(bill_addr_state) : undefined,
      bill_addr_zip: bill_addr_zip ? String(bill_addr_zip) : undefined,
      bill_addr_country: bill_addr_country ? String(bill_addr_country) : undefined,
      xtl_order_id: String(order_id),
      url_cancel: url_cancel || `${baseUrl}/cart`,
      url_complete: url_complete || `${baseUrl}/checkout/success`,
      url_failed: url_failed || `${baseUrl}/checkout/success?status=failed`,
      url_callback: url_callback || `${baseUrl}/callback`,
      url_pending: url_pending || `${baseUrl}/checkout/success?status=pending`,
      cart_name: cart_name || "Hosted-Page",
      return_redirect_url: return_redirect_url || "Y",
    };

    const cleanedPayload: Record<string, unknown> = {};
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) cleanedPayload[k] = v;
    });

    const signature = generateBankfulSignature(cleanedPayload, BANKFUL_SIGN_SECRET);
    cleanedPayload.signature = signature;

    // Make direct API call to Bankful
    try {
      const bankfulResponse = await fetch(BANKFUL_HOSTED_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(cleanedPayload),
      });

      if (!bankfulResponse.ok) {
        throw new Error(`Bankful API error: ${bankfulResponse.status} ${bankfulResponse.statusText}`);
      }

      const bankfulData = await bankfulResponse.json();

      if (bankfulData.redirect_url) {
        // Return the redirect URL to frontend
        return res.status(200).json({
          success: true,
          redirect_url: bankfulData.redirect_url,
          order_id: order_id
        });
      } else {
        throw new Error('Bankful did not return a redirect_url');
      }
    } catch (apiError) {
      console.error('Bankful API call failed:', apiError);
      throw new Error('Failed to communicate with Bankful payment gateway');
    }
  } catch (err) {
    console.error("Bankful create error:", err);
    return res.status(500).json({ success: false, message: "Failed to create bankful payment" });
  }
});

// Callback endpoint from Bankful (webhook)
app.post("/callback", async (req: Request, res: Response) => {
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

      // Send notification email when payment is confirmed
      const emailHtml = `
        <h2>Bankful payment confirmed</h2>
        <p>Order ID: ${escapeHtml(order_id)}</p>
        <p>Status: ${escapeHtml(status)}</p>
        <p>Received at: ${new Date().toISOString()}</p>
      `;

      try {
        await sendSalesEmail(`Bankful payment confirmed: ${escapeHtml(order_id)}`, emailHtml);
      } catch (emailErr) {
        // Don't fail callback because of email issues (callback might be retried by gateway)
        const emailErrorInfo = (emailErr as any)?.response?.body || emailErr;
        console.error("Bankful callback email error:", emailErrorInfo);
      }
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
