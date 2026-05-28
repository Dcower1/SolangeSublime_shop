import { notFound } from "next/navigation";

import ShopPage from "@/app/components/ShopPage";
import { type Producto } from "@/app/components/ProductCard";
import { supabase } from "@/app/lib/supabase";
import {
  buildCategories,
  filterProductsByCategory,
  filterProductsBySearch,
  resolveCategoryParam,
} from "@/app/lib/catalog";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams?: Promise<{
    q?: string | string[];
  }>;
}

export async function generateStaticParams() {
  const { data: productos } = await supabase
    .from("productos")
    .select("*");

  const allProducts = (productos || []) as Producto[];
  const categories = buildCategories(allProducts);

  return categories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const searchQuery = Array.isArray(resolvedSearchParams.q)
    ? resolvedSearchParams.q[0] ?? ""
    : resolvedSearchParams.q ?? "";

  const { data: productos } = await supabase
    .from("productos")
    .select("*");

  const allProducts = (productos || []) as Producto[];
  const categories = buildCategories(allProducts);
  const resolvedCategory = resolveCategoryParam(category, categories);

  if (!resolvedCategory) {
    notFound();
  }

  const filteredProducts = filterProductsByCategory(
    allProducts,
    resolvedCategory
  );
  const searchedProducts = filterProductsBySearch(
    filteredProducts,
    searchQuery
  );

  return (
    <ShopPage
      allProductos={allProducts}
      productos={searchedProducts}
      categories={categories}
      activeCategory={resolvedCategory}
      sectionTitle={
        searchQuery.trim()
          ? `Resultados para "${searchQuery.trim()}"`
          : resolvedCategory
      }
      showHeroBanner={false}
      isCategoryView
    />
  );
}
