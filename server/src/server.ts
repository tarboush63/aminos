import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";


dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL;


const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: FRONTEND_URL,  // http://localhost:8080 for dev
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,     // ✅ enable cookies / credentials

}));

// Rate limiting for endpoints that create checkout sessions
const createSessionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // limit each IP to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// Use JSON body parser for normal routes (not webhook)
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    // leave raw body for webhook verification
    next();
  } else {
    express.json()(req, res, next);
  }
});

/**
 * Utility: map your cart items to Stripe line_items.
 * In production you should validate product IDs/prices server-side instead of trusting client prices.
 */
type CartItem = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number; // in decimal e.g. 19.99
  quantity: number;
  currency?: string; // optional, default usd
};


function toStripeLineItems(items: CartItem[]) {
  return items.map((it) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: it.name,
        description: it.description,
        images: it.image ? [it.image] : undefined,
        metadata: { productId: it.id }
      },
      unit_amount: Math.round(it.price * 100), // cents
    },
    quantity: it.quantity,
  }));
}



const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/checkout/order", async (req, res) => {
  try {
    const { customer, cart, total } = req.body;

    const cartItemsHtml = cart.map(
      (item: any) => `<li>${item.quantity} x ${item.name} - $${item.price}</li>`
    ).join("");

    const mailOptions = {
      from: `"Website Orders" <${process.env.SMTP_USER}>`,
      to: process.env.SALES_EMAIL, // your sales team email
      subject: `New Order from ${customer.name}`,
      html: `
        <h2>New Order Received</h2>
        <h3>Customer Details:</h3>
        <p>Name: ${customer.name}</p>
        <p>Email: ${customer.email}</p>
        <p>Phone: ${customer.phone}</p>
        <p>Address: ${customer.address.street}, ${customer.address.city}, ${customer.address.zip}, ${customer.address.country}</p>
        <h3>Order:</h3>
        <ul>${cartItemsHtml}</ul>
        <p><strong>Total: $${total}</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Order email error:", err);
    res.status(500).json({ success: false, message: "Failed to send order" });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
