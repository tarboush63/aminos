// src/api/checkout.ts
export type CartItemForCheckout = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  currency?: string;
};

const BACKEND = (import.meta.env.VITE_BACKEND_URL ?? "").replace(/\/+$/, ""); // trim trailing slash

// small timeout wrapper to avoid hanging requests in production
async function fetchWithTimeout(input: RequestInfo, init?: RequestInit, timeout = 60000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// validatePromo: call backend to preview discount before checkout
export async function validatePromo(code: string, items: CartItemForCheckout[], total: number) {
  if (!BACKEND) throw new Error("Backend URL is not configured (VITE_BACKEND_URL)");
  const currency = items.length ? items[0].currency ?? "usd" : "usd";
  const res = await fetchWithTimeout(`${BACKEND}/api/promos/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ code: (code || "").trim(), total, currency }),
  }, 60000);
  const text = await res.text().catch(() => "");
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch (err) {
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return { success: true, message: text };
  }
  if (!res.ok) {
    return { success: false, message: json?.message || `HTTP ${res.status}` };
  }
  return {
    success: true,
    promo: json.promo,
    discountAmount: json.discountAmount,
    newTotal: json.newTotal,
    freeShipping: json.freeShipping,
  };
}

// createOrder: accept optional promoCode and send to backend
export async function createOrder(
  items: CartItemForCheckout[],
  customer: { name: string; email: string; phone?: string; address?: string; company?: string; notes?: string; },
  total: number,
  promoCode?: string
) {
  if (!BACKEND) throw new Error("Backend URL is not configured (VITE_BACKEND_URL)");

  const payload: any = {
    items,
    customer,
    total,
    currency: items.length ? items[0].currency ?? "usd" : "usd",
    createdAt: new Date().toISOString(),
  };

  if (promoCode) payload.promoCode = (promoCode || "").trim();

  const res = await fetchWithTimeout(`${BACKEND}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  }, 60000);

  const text = await res.text().catch(() => "");
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (err) {
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return { success: true, message: text || "Order sent (non-JSON response)" };
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json as { success: boolean; message?: string; orderId?: string };
}

export async function createBankfulCheckout(
  items: CartItemForCheckout[],
  customer: { name: string; email: string; phone?: string; address?: string; company?: string; notes?: string; },
  total: number,
  promoCode?: string
) {
  if (!BACKEND) throw new Error("Backend URL is not configured (VITE_BACKEND_URL)");

  const order_id = typeof window !== "undefined" && (window.crypto as any)?.randomUUID ? (window.crypto as any).randomUUID() : `order_${Date.now()}`;

  const baseUrl = window?.location?.origin || "http://localhost:5173";

  const [cust_fname, ...cust_lnameParts] = (customer.name || "").trim().split(" ");
  const cust_lname = cust_lnameParts.join(" ") || undefined;

  const payload: any = {
    order_id,
    transaction_type: "CAPTURE",
    amount: Number(total).toFixed(2),
    request_currency: items.length ? items[0].currency ?? "usd" : "usd",
    cust_fname: cust_fname || undefined,
    cust_lname,
    cust_email: customer.email,
    cust_phone: customer.phone,
    bill_addr: customer.address,
    xtl_order_id: order_id,
    url_cancel: `${baseUrl}/cart`,
    url_complete: `${baseUrl}/checkout/success`,
    url_failed: `${baseUrl}/checkout/success?status=failed`,
    url_callback: `${BACKEND}/callback`,
    url_pending: `${baseUrl}/checkout/success?status=pending`,
    cart_name: "Hosted-Page",
    return_redirect_url: "Y",
    items,
    promoCode: promoCode ? promoCode.trim() : undefined,
  };

  const res = await fetchWithTimeout(`${BACKEND}/api/bankful/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/html,application/xhtml+xml,application/xml" },
    body: JSON.stringify(payload),
  }, 60000);

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    // Try JSON message if the backend returns structured error.
    try {
      const errorJson = JSON.parse(text);
      throw new Error(errorJson.message || `HTTP ${res.status}`);
    } catch {
      throw new Error(text || `HTTP ${res.status}`);
    }
  }

  return { success: true, html: text, order_id };
}

