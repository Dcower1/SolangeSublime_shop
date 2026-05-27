"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Trash2 } from "lucide-react";

import { useCart } from "@/app/context/CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, setQuantity } = useCart();

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [cart]
  );

  const handleBackdropClick = () => onClose();

  return (
    <div
      className={
        "fixed inset-0 z-50 flex justify-end transition-opacity duration-200 " +
        (isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
      }
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className={
          "relative h-full w-full overflow-y-auto bg-white p-6 transition-transform duration-200 md:w-[450px] " +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-pink-500">Tu carrito</h2>

          <button onClick={onClose} className="text-2xl" aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="relative h-20 w-20">
                  <Image
                    src={item.imagen_url}
                    alt={item.nombre}
                    fill
                    className="rounded-xl object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold">{item.nombre}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.cantidad - 1)}
                      className="h-9 w-9 rounded-full border border-gray-200 hover:bg-gray-50"
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
                      className="w-16 rounded-xl border border-gray-200 py-2 text-center"
                      aria-label="Cantidad"
                    />

                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.cantidad + 1)}
                      className="h-9 w-9 rounded-full border border-gray-200 hover:bg-gray-50"
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

                  <p className="font-bold text-pink-500">
                    ${item.precio * item.cantidad}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-red-200 text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
                  aria-label={`Eliminar ${item.nombre}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold">Total: ${total}</h3>

          <button
            className="
              mt-4
              w-full
              rounded-2xl
              bg-green-500
              py-4
              font-bold
              text-white
              transition-all
              hover:bg-green-600
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
