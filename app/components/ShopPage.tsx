import Header from "./Header";
import Navbar from "./Navbar";
import HeroBanner from "./HeroBanner";
import ProductsSection from "./ProductsSection";
import Footer from "./Footer";
import { type Producto } from "./ProductCard";

interface ShopPageProps {
  productos: Producto[];
  categories: string[];
  activeCategory: string;
  sectionTitle?: string;
  showHeroBanner?: boolean;
  isCategoryView?: boolean;
}

export default function ShopPage({
  productos,
  categories,
  activeCategory,
  sectionTitle,
  showHeroBanner = true,
  isCategoryView = false,
}: ShopPageProps) {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <Navbar
        categories={categories}
        activeCategory={activeCategory}
      />

      {showHeroBanner && <HeroBanner />}

      <ProductsSection
        key={`${activeCategory}-${productos.map((product) => product.id).join(",")}`}
        productos={productos}
        title={sectionTitle ?? activeCategory}
        isCategoryView={isCategoryView}
      />

      <Footer />
    </main>
  );
}
