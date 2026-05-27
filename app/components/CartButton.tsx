"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/app/context/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({
  onClick,
}: CartButtonProps) {

  const { cart } = useCart();

  // TOTAL ITEMS
  const totalItems = cart.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  return (

    <button
      onClick={onClick}
      aria-label="Carrito"
      className={
        "group relative inline-flex items-center gap-2 rounded-full px-2 py-2 transition-all duration-300 " +
        (totalItems > 0
          ? "text-pink-500"
          : "text-gray-600 hover:bg-pink-50 hover:text-pink-500")
      }
    >

      <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
      <span className="hidden text-sm font-medium md:inline">Carrito</span>

      {/* CONTADOR */}
      {totalItems > 0 && (

        <span
          className="
            absolute
            -top-2
            -right-3
            bg-pink-500
            text-white
            text-xs
            font-bold
            w-6
            h-6
            rounded-full
            flex
            items-center
            justify-center
            shadow-md
          "
        >
          {totalItems}
        </span>

      )}

    </button>
  );
}
