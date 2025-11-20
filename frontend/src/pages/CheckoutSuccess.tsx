// frontend/src/pages/CheckoutSuccess.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { CartItemForCheckout } from "@/api/checkout";
import { Button } from "@/components/ui/button";

type ApiResponse = {
  id: string;
  amount_total?: number | null;
  currency?: string | null;
  payment_status?: string | null;
  customer_email?: string | null;
  customer_details?: any;
  shipping?: any;
  line_items?: Array<{
    id?: string;
    description?: string | null;
    quantity?: number | null;
    price?: { unit_amount?: number | null; currency?: string | null; product?: string | null };
  }>;
};

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState<boolean>(!!sessionId);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session id in URL");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL ?? ""}/api/checkout/session/${encodeURIComponent(sessionId)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // credentials: 'include' // only if you use cookies auth
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }

        const json = await res.json() as ApiResponse;
        setData(json);
      } catch (err: any) {
        console.error("Failed to load session:", err);
        setError(err?.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p>Loading order details…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to load order</h2>
          <p className="mb-4">{error}</p>
          <Link to="/products" className="underline">Continue shopping</Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formattedAmount = typeof data.amount_total === "number"
    ? ((data.amount_total || 0) / 100).toFixed(2)
    : "N/A";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">Thank you — your order is confirmed</h1>
          <p className="mb-6">
            We received your order. 
            email: <strong>{data.customer_email ?? data.customer_details?.email ?? "your email"}</strong>.
          </p>

          <section className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Order summary</h2>
            <div className="rounded border p-4">
              <p><strong>Order ID:</strong> {data.id}</p>
              <p><strong>Payment status:</strong> {data.payment_status ?? "unknown"}</p>
              <p><strong>Total:</strong> ${formattedAmount} {data.currency?.toUpperCase()}</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Items</h2>
            <div className="space-y-3">
              {(data.line_items ?? []).map((li) => (
                <div key={li.id} className="flex justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{li.description ?? (li.price?.product ?? "Item")}</div>
                    <div className="text-sm text-muted-foreground">Quantity: {li.quantity ?? 1}</div>
                  </div>
                  <div className="font-medium">${((li.price?.unit_amount ?? 0) / 100).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Shipping</h2>
            {data.shipping ? (
              <div className="rounded border p-4">
                <p><strong>Name:</strong> {data.shipping?.name}</p>
                <p><strong>Address:</strong></p>
                <address className="not-italic">
                  {data.shipping?.address?.line1}<br />
                  {data.shipping?.address?.line2 && <>{data.shipping.address.line2}<br/></>}
                  {data.shipping?.address?.city}, {data.shipping?.address?.state} {data.shipping?.address?.postal_code}<br />
                  {data.shipping?.address?.country}
                </address>
                {data.customer_details?.phone && <p><strong>Phone:</strong> {data.customer_details.phone}</p>}
              </div>
            ) : (
              <p>No shipping information collected.</p>
            )}
          </section>

          <div className="flex gap-3">
               <Button asChild variant="outline" className="h-12 px-6">
                  <Link to="/">Continue Shopping</Link>
                </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
