import { supabase } from "@/app/lib/supabase";
import ProductCard from "./ProductCard";

export default async function ProductsSection() {

  const { data: productos } = await supabase
    .from("productos")
    .select("*");

  return (

    <section className="py-14">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-bold text-pink-500">
            Productos destacados 
          </h2>

        </div>

        {/* CARRUSEL HORIZONTAL */}
        <div
        className="
            flex
            gap-6
            overflow-x-auto
            pb-4
            scrollbar-hide
            scroll-smooth
            touch-pan-x
            snap-x
            snap-mandatory
        "
        >

        {productos?.map((producto) => (
            <div key={producto.id} className="snap-start">
                <ProductCard producto={producto} />
            </div>
        ))}

        </div>

      </div>

    </section>
  );
}