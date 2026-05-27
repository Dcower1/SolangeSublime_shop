"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Heart, Search } from "lucide-react";

import CartButton from "./CartButton";
import CartModal from "./CartModal";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearch = (nextValue: string) => {
    const value = nextValue.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawValue = String(formData.get("q") ?? "");
    updateSearch(rawValue);
  };

  return (
    <header className="relative z-30 h-[71px] w-full border-b border-pink-100 bg-white shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* LOGO */}
        <div className="flex flex-shrink-0 items-center">
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
        </div>

        {/* BUSCADOR */}
        <form
          key={`${pathname}-${searchParams.toString()}`}
          onSubmit={handleSearchSubmit}
          className="flex min-w-0 flex-1 items-center justify-center px-2 sm:px-4"
        >
          <label className="sr-only" htmlFor="site-search">
            Buscar productos
          </label>

          <div className="flex w-full max-w-[420px] items-center gap-2 rounded-full border border-pink-100 bg-pink-50/70 px-3 py-2 text-gray-600 shadow-sm transition-all focus-within:border-pink-300 focus-within:bg-white">
            <Search className="h-4 w-4 flex-shrink-0 text-pink-400" />
            <input
              id="site-search"
              name="q"
              type="search"
              defaultValue={searchParams.get("q") ?? ""}
              placeholder="Buscar productos"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </form>

        {/* ACCIONES */}
        <nav aria-label="Acciones principales">
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

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
