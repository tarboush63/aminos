// server/src/server.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sgMail from "@sendgrid/mail";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "*";
const SALES_EMAIL = process.env.SALES_EMAIL;

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

// API: create order
app.post("/api/orders", orderLimiter, async (req: Request, res: Response) => {
  try {
    const { customer, items, total } = req.body;

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

app.get("/", (_req, res) => res.send("Server running"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
