"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ProductCard, { type Producto } from "./ProductCard";
import { HOME_PAGE, normalizeCategory } from "@/app/lib/catalog";

interface ProductsSectionProps {
  productos: Producto[];
  title: string;
  isCategoryView?: boolean;
}

export default function ProductsSection({
  productos,
  title,
  isCategoryView = false,
}: ProductsSectionProps) {
  const mobilePageSize = 6;
  const [mobilePage, setMobilePage] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const totalMobilePages = Math.max(
    1,
    Math.ceil(productos.length / mobilePageSize)
  );

  const mobileProducts = useMemo(() => {
    if (!isCategoryView) return productos;

    const startIndex = (mobilePage - 1) * mobilePageSize;
    return productos.slice(startIndex, startIndex + mobilePageSize);
  }, [isCategoryView, mobilePage, productos]);

  const shouldPaginate = isCategoryView && productos.length > mobilePageSize;

  const goToPage = (nextPage: number) => {
    setMobilePage(Math.min(Math.max(nextPage, 1), totalMobilePages));
  };

  const updateCarouselScrollState = () => {
    const container = carouselRef.current;

    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScrollLeft - 1);
  };

  useEffect(() => {
    if (isCategoryView) return;

    updateCarouselScrollState();
    window.addEventListener("resize", updateCarouselScrollState);

    return () => {
      window.removeEventListener("resize", updateCarouselScrollState);
    };
  }, [isCategoryView, productos]);

  const scrollCarousel = (direction: -1 | 1) => {
    const container = carouselRef.current;

    if (!container) return;

    container.scrollBy({
      left: direction * 360,
      behavior: "smooth",
    });
  };

  const titleText =
    normalizeCategory(title) === normalizeCategory(HOME_PAGE)
      ? "Productos destacados"
      : title;

  return (
    <section id="catalogo" className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-3xl font-bold text-pink-500">{titleText}</h2>

        {productos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 px-6 py-12 text-center text-gray-500">
            No se encontraron productos para esta busqueda.
          </div>
        ) : isCategoryView ? (
          <>
            <div className="grid gap-4 pb-4 md:hidden">
              {mobileProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>

            {shouldPaginate && (
              <div className="mb-8 flex items-center justify-between gap-3 md:hidden">
                <button
                  type="button"
                  onClick={() => goToPage(mobilePage - 1)}
                  disabled={mobilePage === 1}
                  className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-500 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                <span className="text-sm font-medium text-gray-500">
                  {mobilePage} / {totalMobilePages}
                </span>

                <button
                  type="button"
                  onClick={() => goToPage(mobilePage + 1)}
                  disabled={mobilePage === totalMobilePages}
                  className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-500 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}

            <div className="hidden pb-4 md:flex md:flex-wrap md:gap-6">
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </>
        ) : (
          <div className="relative">
            <div
              ref={carouselRef}
              onScroll={updateCarouselScrollState}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            >
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              disabled={!canScrollLeft}
              className="
                absolute left-0 top-1/2 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center
                rounded-full border border-pink-200 bg-white text-pink-500 shadow-lg transition-all hover:bg-pink-50
                disabled:cursor-not-allowed disabled:opacity-30 md:inline-flex
              "
              aria-label="Desplazar catalogo hacia la izquierda"
            >
              <span className="text-2xl leading-none">‹</span>
            </button>

            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              disabled={!canScrollRight}
              className="
                absolute right-0 top-1/2 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center
                rounded-full border border-pink-200 bg-white text-pink-500 shadow-lg transition-all hover:bg-pink-50
                disabled:cursor-not-allowed disabled:opacity-30 md:inline-flex
              "
              aria-label="Desplazar catalogo hacia la derecha"
            >
              <span className="text-2xl leading-none">›</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
