import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "*";
const SALES_EMAIL = process.env.SALES_EMAIL;

if (!SALES_EMAIL) throw new Error("SALES_EMAIL is not configured");

const app = express();
const allowedOrigins = [
  "https://aminospep.com",
  "https://www.aminospep.com",
  "http://localhost:5173" // dev, if needed
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


// Rate limiter for orders
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // adjust per needs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many orders from this IP, please wait." },
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true only for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
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
      <li>${item.quantity} x ${safeHtml(item.name)} - $${item.price.toFixed(2)}</li>
    `).join("");

    // Build email
    const mailOptions = {
      from: `"Website Orders" <${process.env.SMTP_USER}>`,
      to: SALES_EMAIL,
      subject: `New Order from ${safeHtml(customer.name)}`,
      html: `
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
        <p><strong>Total: $${total.toFixed(2)}</strong></p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Order received. Our sales team will contact you shortly." });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ success: false, message: "Failed to process order" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
