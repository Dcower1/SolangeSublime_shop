"use client";

import { useState } from "react";

import { Menu, X } from "lucide-react";

interface NavbarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function Navbar({
  categories,
  selectedCategory,
  setSelectedCategory,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-[#333] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 md:hidden">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            Categorías
          </span>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-white transition-colors hover:bg-white/10"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-category-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="hidden md:block">
          <ul className="flex items-center justify-center gap-8 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className={`
                    relative whitespace-nowrap font-medium transition-all duration-300
                    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-pink-500 after:transition-all after:duration-300 after:content-['']
                    hover:after:w-full
                    ${
                      selectedCategory === category
                        ? "text-pink-500 after:w-full"
                        : "text-white"
                    }
                  `}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div
          id="mobile-category-menu"
          className={`md:hidden overflow-hidden border-t border-white/10 transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="grid max-h-[70vh] grid-cols-2 gap-2 overflow-y-auto py-3">
            {categories.map((category) => (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className={`
                    w-full rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all duration-300
                    ${
                      selectedCategory === category
                        ? "bg-pink-500 text-white"
                        : "bg-white/5 text-white hover:bg-white/10"
                    }
                  `}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
