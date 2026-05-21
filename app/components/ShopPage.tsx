"use client";

import { useState } from "react";

import Header from "./Header";
import Navbar from "./Navbar";
import HeroBanner from "./HeroBanner";
import ProductsSection from "./ProductsSection";
import Footer from "./Footer";
import { type Producto } from "./ProductCard";

interface ShopPageProps {
  productos: Producto[];
}

function normalizeCategory(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default function ShopPage({
  productos,
}: ShopPageProps) {

  const [selectedCategory, setSelectedCategory] =
    useState("Todos");

  const baseCategories = [
    "Todos",
    "Ofertas",
    "SuperBox",
    "Ropa",
    "Calzado",
    "Accesorios",
    "Maquillaje",
    "Peluches",
    "Otros",
  ];

  const dataCategories = Array.from(
    new Set(
      productos
        .map((p) => p?.categoria)
        .filter((c): c is string => typeof c === "string" && c.trim() !== "")
    )
  );

  const categories = [
    ...baseCategories,
    ...dataCategories.filter(
      (c) =>
        !baseCategories.some(
          (base) => normalizeCategory(base) === normalizeCategory(c)
        )
    ),
  ];

  // FILTRAR PRODUCTOS
  const filteredProducts =
    selectedCategory === "Todos"
      ? productos
      : productos.filter(
          (producto) =>
            normalizeCategory(producto?.categoria) ===
            normalizeCategory(selectedCategory)
        );

  return (

    <main className="bg-[#f5f5f5] min-h-screen">

      <Header />

      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <HeroBanner
        setSelectedCategory={setSelectedCategory}
      />

      <ProductsSection
        productos={filteredProducts}
        title={selectedCategory}
      />

      <Footer />

    </main>
  );
}
