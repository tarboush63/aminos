// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
// Keep sonner toast if you're using it; it's harmless even if you also have a custom wrapper component.
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  sku?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = "amino_cart_v1";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch (err) {
      console.error("[CartContext] failed parsing localStorage:", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      // debug persistence
      console.debug("[CartContext] persisted cart -> localStorage, len=", items.length);
    } catch (err) {
      console.error("[CartContext] failed persisting cart:", err);
    }
  }, [items]);

  const addItem = (product: Omit<CartItem, "quantity">, qty = 1) => {
    console.debug("[CartContext] addItem called", { product, qty });
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        const updated = prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
        // immediate debug so you see update intention before toast
        console.debug("[CartContext] addItem -> updated quantity", {
          id: product.id,
          prevQuantity: existing.quantity,
          newQuantity: existing.quantity + qty,
        });
        toast.success(`${product.name} quantity updated in cart.`);
        return updated;
      }
      const newItem: CartItem = { ...product, quantity: qty };
      console.debug("[CartContext] addItem -> new item created", newItem);
      toast.success(`${product.name} added to cart.`);
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string) => {
    console.debug("[CartContext] removeItem called", id);
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      console.debug("[CartContext] removeItem -> new length", next.length);
      return next;
    });
    toast(`${"Item removed from cart."}`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.debug("[CartContext] updateQuantity called", { id, quantity });
    if (quantity <= 0) {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        console.debug("[CartContext] updateQuantity -> removed item because quantity <= 0", { id, nextLen: next.length });
        return next;
      });
      toast(`${"Item removed from cart."}`);
      return;
    }
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, quantity } : i));
      console.debug("[CartContext] updateQuantity -> applied", { id, quantity });
      return next;
    });
  };

  const clearCart = () => {
    console.debug("[CartContext] clearCart called");
    setItems([]);
    toast(`${"Cart cleared."}`);
  };

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = items.reduce((s, it) => s + it.quantity * (it.price ?? 0), 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Safe hook: returns no-op fallback and logs a warning — prevents blank page if provider missing.
 */
export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    console.warn(
      "useCart() called but CartProvider is not mounted. Returning fallback no-op cart. " +
        "Wrap your app with <CartProvider> to get full cart behavior."
    );
    return {
      items: [],
      addItem: () => {
        console.warn("Cart addItem noop: provider not mounted.");
      },
      removeItem: () => {
        console.warn("Cart removeItem noop: provider not mounted.");
      },
      updateQuantity: () => {
        console.warn("Cart updateQuantity noop: provider not mounted.");
      },
      clearCart: () => {
        console.warn("Cart clearCart noop: provider not mounted.");
      },
      totalItems: 0,
      totalPrice: 0,
    };
  }
  return ctx;
};
