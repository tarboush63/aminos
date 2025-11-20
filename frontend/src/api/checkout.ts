// frontend/src/api/checkout.ts
export type CartItemForCheckout = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  currency?: string;
};

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "";

export async function createCheckoutSession(items: CartItemForCheckout[], customerEmail?: string) {
  const res = await fetch(`${BACKEND}/api/checkout/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items, customerEmail }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("createCheckoutSession failed:", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  // this should be { url: string }
  return res.json() as Promise<{ url?: string }>;
}
