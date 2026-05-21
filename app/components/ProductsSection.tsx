import ProductCard, { type Producto } from "./ProductCard";

interface ProductsSectionProps {
  productos: Producto[];
  title: string;
}

export default function ProductsSection({
  productos,
  title,
}: ProductsSectionProps) {

  return (

    <section className="py-14">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-pink-500 mb-8">

          {title === "Todos"
            ? "Productos destacados ✨"
            : title}

        </h2>

        <div
          className="
            flex
            gap-6
            overflow-x-auto
            pb-4
            scrollbar-hide
          "
        >

          {productos.map((producto) => (

            <ProductCard
              key={producto.id}
              producto={producto}
            />

          ))}

        </div>

      </div>

    </section>
  );
}
