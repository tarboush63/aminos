// src/pages/Cart.tsx
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder, CartItemForCheckout } from "@/api/checkout";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\d()\-.\s]{7,20}$/; // permissive; adjust to your locale

const Cart = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!emailRegex.test(form.email.trim())) errs.email = "Invalid email address";
    if (form.phone && !phoneRegex.test(form.phone)) errs.phone = "Invalid phone number";
    if (!form.address.trim()) errs.address = "Address is required";
    // company and notes optional
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmitOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setError("Please fix validation errors and try again.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty. Add items before checking out.");
      return;
    }

    setSubmitting(true);
    try {
      const payloadItems: CartItemForCheckout[] = items.map((i) => ({
        id: i.id,
        name: i.name,
        image: i.image ?? "https://via.placeholder.com/300",
        price: i.price ?? 0,
        quantity: i.quantity,
        currency: "usd",
      }));

      const total = Number(totalPrice.toFixed(2));
      const resp = await createOrder(payloadItems, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        company: form.company.trim(),
        notes: form.notes.trim(),
      }, total);

      if (resp?.success) {
        setSuccess(resp.message || "Order submitted. Our sales team will contact you via email.");
        clearCart();
        setCheckoutOpen(false);
        
      } else {
        // backend returned success: false
        throw new Error(resp?.message || "Order submission failed");
      }
    } catch (err: any) {
      console.error("Order submission failed:", err);
      setError(err?.message || "Failed to submit order. Please try again or contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shopping Cart</h1>
            <p className="text-xl text-muted-foreground">Review your items before checkout</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Looks like you haven't added any research peptides to your cart yet. Browse our catalog to find the products you need.
              </p>
              <Button asChild className="btn-gold h-12 px-8">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-muted border border-border">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        {item.sku && <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>}
                        <p className="text-sm text-muted-foreground">${(item.price ?? 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <div className="px-4 py-2 border rounded">{item.quantity}</div>
                      <Button variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </Button>
                      <Button variant="destructive" onClick={() => removeItem(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
                <p className="mb-2">Total Items: <strong>{totalItems}</strong></p>
                <p className="mb-6">Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>

                {success && <div className="text-sm text-green-600 mb-2">{success}</div>}
                {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

                {!checkoutOpen ? (
                  <div className="space-y-3">
                    <Button
                      className="w-full btn-gold h-12"
                      onClick={() => { setError(null); setCheckoutOpen(true); }}
                      disabled={submitting}
                    >
                      Proceed to Checkout
                    </Button>

                    <Button variant="outline" className="w-full h-12" onClick={() => clearCart()}>
                      Clear Cart
                    </Button>

                    <Button asChild className="w-full" variant="ghost">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitOrder} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium">Full name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 ${formErrors.name ? "border-red-600" : "border-border"}`}
                        required
                      />
                      {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 ${formErrors.email ? "border-red-600" : "border-border"}`}
                        required
                      />
                      {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 ${formErrors.phone ? "border-red-600" : "border-border"}`}
                        placeholder="+1 555 555 5555"
                      />
                      {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Address - ZIP Code & Apartment*</label>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 ${formErrors.address ? "border-red-600" : "border-border"}`}
                        required
                      />
                      {formErrors.address && <p className="text-xs text-red-600 mt-1">{formErrors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Company (optional)</label>
                      <input name="company" value={form.company} onChange={handleChange} className="mt-1 block w-full rounded-md border px-3 py-2 border-border" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Notes (optional)</label>
                      <textarea name="notes" value={form.notes} onChange={handleChange} className="mt-1 block w-full rounded-md border px-3 py-2 border-border" rows={3} />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="btn-gold flex-1 h-12" disabled={submitting}>
                        {submitting ? "Submitting..." : `Place Order — $${totalPrice.toFixed(2)}`}
                      </Button>
                      <Button type="button" variant="outline" className="h-12" onClick={() => setCheckoutOpen(false)} disabled={submitting}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
