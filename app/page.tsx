import { supabase } from "@/app/lib/supabase";
import ShopPage from "@/app/components/ShopPage";
import {
  buildCategories,
  HOME_PAGE,
  filterProductsBySearch,
} from "@/app/lib/catalog";
import type { Producto } from "@/app/components/ProductCard";

interface HomePageProps {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const searchQuery = Array.isArray(resolvedSearchParams.q)
    ? resolvedSearchParams.q[0] ?? ""
    : resolvedSearchParams.q ?? "";

  const { data: productos } = await supabase
    .from("productos")
    .select("*");

  const allProducts = (productos || []) as Producto[];
  const categories = buildCategories(allProducts);
  const filteredProducts = filterProductsBySearch(allProducts, searchQuery);

  return (
    <ShopPage
      allProductos={allProducts}
      productos={filteredProducts}
      categories={categories}
      activeCategory={HOME_PAGE}
      sectionTitle={
        searchQuery.trim()
          ? `Resultados para "${searchQuery.trim()}"`
          : HOME_PAGE
      }
      showHeroBanner={!searchQuery.trim()}
      isCategoryView={false}
    />
  );
}
