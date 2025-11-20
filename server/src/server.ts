import express, { Request, Response } from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";


dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY in environment");
  process.exit(1);
}

const stripe = require('stripe')(STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});

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

type CheckoutSessionResponse = {
  id: string;
  url?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  payment_status?: string | null;
  customer_email?: string | null;
  customer_details?: Stripe.Checkout.Session["customer_details"] | null;
  shipping?: null;
  line_items?: Array<{
    id?: string;
    description?: string | null;
    quantity?: number | null;
    price?: {
      id?: string | null;
      unit_amount?: number | null;
      currency?: string | null;
      product?: string | null;
      product_data?: any;
    } | null;
  }>;
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

/**
 * POST /api/checkout/session
 * Body: { items: CartItem[], customerEmail?: string }
 */
app.post("/api/checkout/session", createSessionLimiter, async (req: Request, res: Response) => {
  try {
    const { items, customerEmail } = req.body as { items: CartItem[]; customerEmail?: string };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    // IMPORTANT: in production validate product IDs/prices here
    const line_items = toStripeLineItems(items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cart`,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US"] // only example countries
        },
      customer_email: customerEmail,
    });

    // Return the hosted URL so the frontend can redirect the browser there
    // session.url is the full Stripe-hosted checkout page
    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("create session error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string | undefined;
    const rawBody = req.body as Buffer;

    if (!sig || !STRIPE_WEBHOOK_SECRET) {
      console.error("Missing webhook secret or signature header");
      return res.status(400).send("Webhook error: missing signature or secret");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Fulfill the order: record payment, create order in DB, send email, etc.
        console.log("✅ Checkout session completed:", session.id, "amount_total:", session.amount_total);
        // Example: mark order paid in DB using session.metadata or session.client_reference_id
        break;
      }
      case "payment_intent.succeeded": {
        // Optional: handle payment intent
        break;
      }
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

/**GET /api/checkout/session/:id */
app.get("/api/checkout/session/:id", async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  if (!sessionId || !sessionId.startsWith("cs_")) {
    // basic sanity check; Stripe checkout session ids start with "cs_"
    return res.status(400).json({ error: "Invalid session id" });
  }

  try {
    // retrieve session and expand line_items & customer details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    // build a small, safe response for frontend
    const result: CheckoutSessionResponse = {
      id: session.id,
      url: session.url ?? null,
      amount_total: session.amount_total ?? null,
      currency: (session.currency ?? session.amount_total ? (session.currency ?? null) : null) || null,
      payment_status: session.payment_status ?? null,
      customer_email: session.customer_email ?? null,
      customer_details: session.customer_details ?? null,
      shipping: session.shipping ?? null,
      line_items: (session.line_items?.data ?? []).map((li: any) => ({
        id: li.id,
        description: li.description ?? null,
        quantity: li.quantity ?? null,
        price: li.price
          ? {
              id: li.price.id,
              unit_amount: li.price.unit_amount ?? null,
              currency: li.price.currency ?? null,
              product: li.price.product ?? null,
              product_data: li.price.product ? undefined : li.price.product_data ?? undefined,
            }
          : null,
      })),
    };

    return res.json(result);
  } catch (err: any) {
    console.error("Error retrieving checkout session:", err);
    return res.status(500).json({ error: "Failed to retrieve checkout session" });
  }
});

app.get("/", (_req, res) => res.send("Stripe backend running"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
