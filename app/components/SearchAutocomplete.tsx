"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Search, X } from "lucide-react";

import { type Producto } from "./ProductCard";
import { filterProductsBySearch } from "@/app/lib/catalog";

interface SearchAutocompleteProps {
  productos: Producto[];
}

export default function SearchAutocomplete({
  productos,
}: SearchAutocompleteProps) {
  const MIN_CHARS = 2;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [isOpen, setIsOpen] = useState(false);
  const shouldShowSuggestions = query.trim().length >= MIN_CHARS;

  const suggestions = useMemo(() => {
    const results = filterProductsBySearch(productos, deferredQuery);
    return results.slice(0, 6);
  }, [deferredQuery, productos]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const updateSearch = (nextValue: string) => {
    const value = nextValue.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearch(query);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    updateSearch("");
    setIsOpen(false);
  };

  const handleSelect = (value: string) => {
    setQuery(value);
    updateSearch(value);
    setIsOpen(false);
  };

  const closeIfTooShort = (nextValue: string) => {
    setIsOpen(nextValue.trim().length >= MIN_CHARS);
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-none md:max-w-[420px]">
      <form onSubmit={handleSubmit} className="relative">
        <label className="sr-only" htmlFor="site-search">
          Buscar productos
        </label>

        <div className="flex min-h-[46px] items-center gap-2 rounded-full border border-pink-100 bg-pink-50/70 px-3 py-2 text-gray-600 shadow-sm transition-all focus-within:border-pink-300 focus-within:bg-white sm:min-h-[48px]">
          <Search className="h-4 w-4 flex-shrink-0 text-pink-400" />
          <input
            id="site-search"
            name="q"
            type="search"
            value={query}
            onChange={(event) => {
              const nextValue = event.target.value;
              setQuery(nextValue);
              closeIfTooShort(nextValue);
            }}
            onFocus={() => closeIfTooShort(query)}
            placeholder="Buscar productos"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
            autoComplete="off"
          />

          {query.trim() && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-pink-500 transition-colors hover:bg-pink-100"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isOpen && shouldShowSuggestions && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-2xl">
            <div className="border-b border-pink-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-400 sm:text-xs">
                Sugerencias
              </p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 sm:max-h-80">
              {suggestions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No hay coincidencias.
                </div>
              ) : (
                suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelect(product.nombre)}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-pink-50 sm:py-3"
                  >
                    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-12 sm:w-12">
                      <Image
                        src={product.imagen_url}
                        alt={product.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {product.nombre}
                      </h3>
                      <p className="truncate text-[11px] text-gray-500 sm:text-xs">
                        {product.categoria}
                      </p>
                    </div>

                    <span className="flex-shrink-0 rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-600 sm:px-3 sm:text-sm">
                      ${product.precio}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
