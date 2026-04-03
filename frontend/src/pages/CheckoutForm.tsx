import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { createBankfulCheckout } from "@/api/checkout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CheckoutForm = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: { street: "", city: "", zip: "", country: "" }
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["street","city","zip","country"].includes(name)) {
      setCustomer(prev => ({ ...prev, address: { ...prev.address, [name]: value }}));
    } else {
      setCustomer(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const resp = await createBankfulCheckout(
        items.map((i) => ({
          id: i.id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          currency: "usd",
        })),
        {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          address: `${customer.address.street} ${customer.address.city} ${customer.address.zip} ${customer.address.country}`.trim(),
        },
        Number(totalPrice)
      );

      // Handle JSON response with redirect_url
      if (resp?.redirect_url) {
        // Clear cart before redirecting to payment
        clearCart();
        // Redirect to Bankful hosted payment page
        window.location.href = resp.redirect_url;
        return;
      }

      // Fallback: Handle HTML response (legacy support)
      if (resp?.success && resp.html) {
        // Auto-submit HTML from backend to redirect to Bankful
        document.open();
        document.write(resp.html);
        document.close();
        return;
      }

      throw new Error("Failed to initiate payment redirect");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Shipping Details</h2>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          name="name"
          value={customer.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={customer.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Street *</Label>
        <Input
          id="street"
          name="street"
          value={customer.address.street}
          onChange={handleChange}
          placeholder="Street"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City *</Label>
        <Input
          id="city"
          name="city"
          value={customer.address.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip">Zip / Postal Code *</Label>
        <Input
          id="zip"
          name="zip"
          value={customer.address.zip}
          onChange={handleChange}
          placeholder="Zip / Postal Code"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country *</Label>
        <Input
          id="country"
          name="country"
          value={customer.address.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "Submitting..." : "Place Order"}
      </button>
    </form>
  );
};

export default CheckoutForm;
