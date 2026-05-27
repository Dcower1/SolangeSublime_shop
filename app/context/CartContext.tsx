"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string;
  cantidad: number;
  stock?: number | null;
}

type AddToCartProduct = Omit<CartItem, "cantidad">;

interface CartContextType {
  cart: CartItem[];
  addToCart: (producto: AddToCartProduct) => void;
  removeFromCart: (id: number) => void;
  setQuantity: (id: number, cantidad: number) => void;
}

const CartContext =
  createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    const savedCart = window.localStorage.getItem("cart");
    if (!savedCart) return [];

    try {
      return JSON.parse(savedCart) as CartItem[];
    } catch {
      return [];
    }
  });

  // GUARDAR LOCALSTORAGE
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  // AGREGAR
  const addToCart = (producto: AddToCartProduct) => {
    const maxStock =
      typeof producto.stock === "number" ? producto.stock : null;

    if (typeof maxStock === "number" && maxStock <= 0) {
      return;
    }

    setCart((prev) => {

      const existing =
        prev.find(
          (item) => item.id === producto.id
        );

      if (existing) {
        const existingMaxStock =
          typeof existing.stock === "number" ? existing.stock : null;

        if (
          typeof existingMaxStock === "number" &&
          existing.cantidad >= existingMaxStock
        ) {
          return prev;
        }

        return prev.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );

      }

      return [
        ...prev,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    });
  };

  // ELIMINAR
  const removeFromCart = (id: number) => {

    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const setQuantity = (id: number, cantidad: number) => {
    if (!Number.isFinite(cantidad)) return;

    setCart((prev) => {
      const current = prev.find((item) => item.id === id);
      if (!current) return prev;

      const maxStock =
        typeof current.stock === "number" ? current.stock : null;

      const nextCantidad = Math.floor(cantidad);

      if (nextCantidad <= 0) {
        return prev.filter((item) => item.id !== id);
      }

      const clamped =
        typeof maxStock === "number"
          ? Math.min(nextCantidad, Math.max(1, maxStock))
          : nextCantidad;

      return prev.map((item) =>
        item.id === id ? { ...item, cantidad: clamped } : item
      );
    });
  };

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        setQuantity,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}

export function useCart() {

  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}
