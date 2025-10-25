// src/pages/Cart.tsx
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * Definitive Cart page that reads from CartContext.
 * - Shows items from useCart()
 * - Provides quantity controls and remove/clear actions
 * - Includes console.debug for deterministic visibility
 */

const Cart = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  // Debug: always print current items when Cart renders
  console.debug("[Cart page] render: items=", items, "totalItems=", totalItems, "totalPrice=", totalPrice);

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

                <div className="space-y-3">
                  <Button
                    className="w-full btn-gold h-12"
                    onClick={() => {
                      // placeholder for checkout; keep simple alert for now
                      window.alert("Proceeding to checkout (implement actual checkout flow).");
                    }}
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
