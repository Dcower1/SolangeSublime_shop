"use client";

import Image from "next/image";
import { useState } from "react";

import { Heart, User } from "lucide-react";

import CartButton from "./CartButton";
import CartModal from "./CartModal";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="relative z-30 w-full h-[71px] bg-white border-b border-pink-100 shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* LOGO */}
        <div className="flex flex-shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="SolangeSublime"
            width={110}
            height={110}
            sizes="(max-width: 640px) 92px, 110px"
            className="h-auto w-[92px] flex-shrink-0 object-contain sm:w-[104px] md:w-[110px]"
            priority
          />
        </div>

        {/* ACCIONES */}
        <nav aria-label="Acciones principales">
          <ul className="flex items-center gap-1 sm:gap-2 md:gap-6">
            <li>
              <a
                href="#"
                aria-label="Iniciar sesión"
                className="group inline-flex items-center gap-2 rounded-full px-2 py-2 text-gray-600 transition-all duration-300 hover:bg-pink-50 hover:text-pink-500"
              >
                <User className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                <span className="hidden text-sm font-medium md:inline">
                  Iniciar sesión
                </span>
              </a>
            </li>

            <li>
              <a
                href="#"
                aria-label="Favoritos"
                className="group inline-flex items-center gap-2 rounded-full px-2 py-2 text-gray-600 transition-all duration-300 hover:bg-pink-50 hover:text-pink-500"
              >
                <Heart className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                <span className="hidden text-sm font-medium md:inline">
                  Favoritos
                </span>
              </a>
            </li>

            <li>
              <CartButton onClick={() => setIsCartOpen(true)} />
            </li>
          </ul>
        </nav>
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
