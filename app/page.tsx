import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import HeroBanner from "@/app/components/HeroBanner";
import ProductsSection from "@/app/components/ProductsSection";
//import Footer from "@/app/components/Footer";

export default async function Home() {

  const { data: productos } = await supabase
    .from("productos")
    .select("*");

  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      <Header />
      <Navbar />
      <HeroBanner />
      <ProductsSection productos={productos || []} />

      

    </main>
  );
}