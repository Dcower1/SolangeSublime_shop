"use client";

import Image from "next/image";
import { useMemo } from "react";

import { useCart } from "@/app/context/CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, setQuantity } = useCart();

  const total = useMemo(
    () =>
      cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [cart]
  );

  const handleBackdropClick = () => onClose();

  return (
    <div
      className={
        "fixed inset-0 z-50 flex justify-end transition-opacity duration-200 " +
        (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
      }
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className={
          "relative w-full md:w-[450px] h-full bg-white p-6 overflow-y-auto transition-transform duration-200 " +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-500">Tu carrito 🛒</h2>

          <button onClick={onClose} className="text-2xl" aria-label="Cerrar">
            ✖
          </button>
        </div>

        <div className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.imagen_url}
                    alt={item.nombre}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold">{item.nombre}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.cantidad - 1)}
                      className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50"
                      aria-label="Disminuir"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={typeof item.stock === "number" ? item.stock : undefined}
                      value={item.cantidad}
                      onChange={(e) => {
                        const parsed = Number(e.target.value);
                        setQuantity(item.id, parsed);
                      }}
                      className="w-16 text-center border border-gray-200 rounded-xl py-2"
                      aria-label="Cantidad"
                    />

                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.cantidad + 1)}
                      className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50"
                      aria-label="Aumentar"
                      disabled={
                        typeof item.stock === "number" &&
                        item.cantidad >= item.stock
                      }
                    >
                      +
                    </button>

                    {typeof item.stock === "number" && (
                      <span className="text-xs text-gray-400">
                        Stock: {item.stock}
                      </span>
                    )}
                  </div>
                  <p className="text-pink-500 font-bold">
                    ${item.precio * item.cantidad}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Eliminar"
                  className="text-xl"
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold">Total: ${total}</h3>

          <button
            className="
              w-full
              mt-4
              bg-green-500
              hover:bg-green-600
              text-white
              py-4
              rounded-2xl
              font-bold
              transition-all
            "
            disabled={cart.length === 0}
          >
            Finalizar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
