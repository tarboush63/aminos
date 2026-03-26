import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { createBankfulCheckout } from "@/api/checkout";

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
          currency: i.currency || "usd",
        })),
        {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          address: `${customer.address.street} ${customer.address.city} ${customer.address.zip} ${customer.address.country}`.trim(),
        },
        Number(totalPrice)
      );

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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Shipping Details</h2>

      <input name="name" value={customer.name} onChange={handleChange} placeholder="Full Name" required />
      <input type="email" name="email" value={customer.email} onChange={handleChange} placeholder="Email" required />
      <input name="phone" value={customer.phone} onChange={handleChange} placeholder="Phone" />

      <input name="street" value={customer.address.street} onChange={handleChange} placeholder="Street" required />
      <input name="city" value={customer.address.city} onChange={handleChange} placeholder="City" required />
      <input name="zip" value={customer.address.zip} onChange={handleChange} placeholder="Zip / Postal Code" required />
      <input name="country" value={customer.address.country} onChange={handleChange} placeholder="Country" required />

      {error && <p className="text-red-600">{error}</p>}

      <button type="submit" disabled={busy}>
        {busy ? "Submitting..." : "Place Order"}
      </button>
    </form>
  );
};

export default CheckoutForm;
