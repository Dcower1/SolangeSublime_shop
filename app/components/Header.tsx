"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Heart } from "lucide-react";

import CartButton from "./CartButton";
import CartModal from "./CartModal";
import SearchAutocomplete from "./SearchAutocomplete";
import { type Producto } from "./ProductCard";

interface HeaderProps {
  productos: Producto[];
}

export default function Header({ productos }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="relative z-30 w-full border-b border-pink-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:h-[71px] md:py-0">
        <div className="flex flex-col gap-3 md:h-full md:flex-row md:items-center md:gap-4">
          <div className="flex items-center justify-between gap-3 md:flex-shrink-0 md:justify-start">
            <Link href="/" aria-label="Ir a la página principal">
              <Image
                src="/logo.png"
                alt="SolangeSublime"
                width={110}
                height={110}
                sizes="(max-width: 640px) 92px, 110px"
                className="h-auto w-[92px] flex-shrink-0 object-contain sm:w-[104px] md:w-[110px]"
                priority
              />
            </Link>

            <nav aria-label="Acciones principales" className="md:hidden">
              <ul className="flex items-center gap-1">
                <li>
                  <Link
                    href="/categories/Favoritos"
                    aria-label="Favoritos"
                    className="group inline-flex items-center justify-center rounded-full px-2 py-2 text-gray-600 transition-all duration-300 hover:bg-pink-50 hover:text-pink-500"
                  >
                    <Heart className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                  </Link>
                </li>

                <li>
                  <CartButton onClick={() => setIsCartOpen(true)} />
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex min-w-0 flex-1 items-center md:px-2">
            <SearchAutocomplete productos={productos} />
          </div>

          <nav aria-label="Acciones principales" className="hidden md:block">
            <ul className="flex items-center gap-1 sm:gap-2 md:gap-6">
              <li>
                <Link
                  href="/categories/Favoritos"
                  aria-label="Favoritos"
                  className="group inline-flex items-center gap-2 rounded-full px-2 py-2 text-gray-600 transition-all duration-300 hover:bg-pink-50 hover:text-pink-500"
                >
                  <Heart className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                  <span className="hidden text-sm font-medium md:inline">
                    Favoritos
                  </span>
                </Link>
              </li>

              <li>
                <CartButton onClick={() => setIsCartOpen(true)} />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
