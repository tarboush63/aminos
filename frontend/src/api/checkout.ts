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

/**
 * Submit an order to backend which sends email to sales.
 * Expects backend to return JSON with shape { success: boolean, message?: string, orderId?: string }
 */
export async function createOrder(
  items: CartItemForCheckout[],
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    company?: string;
    notes?: string;
  },
  total: number
): Promise<{ success: boolean; message?: string; orderId?: string }> {
  if (!BACKEND) throw new Error("Backend URL is not configured (VITE_BACKEND_URL)");

  const payload = {
    items,
    customer,
    total,
    currency: items.length ? items[0].currency ?? "usd" : "usd",
    createdAt: new Date().toISOString(),
  };

  const res = await fetchWithTimeout(`${BACKEND}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  }, 20000);

  // handle non-JSON gracefully
  const text = await res.text().catch(() => "");
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (err) {
    // not JSON
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return { success: true, message: text || "Order sent (non-JSON response)" };
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json as { success: boolean; message?: string; orderId?: string };
}

