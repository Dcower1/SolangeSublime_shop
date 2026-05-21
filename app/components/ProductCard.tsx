import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  favorito: boolean;
}

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  return (
    <div
      className="
        min-w-[280px]
        max-w-[280px]
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-md
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        border
        border-pink-100
        flex-shrink-0
      "
    >
      {/* IMAGEN */}
      <div className="relative w-full h-64 bg-pink-50">
        <Image
          src={producto.imagen_url}
          alt={producto.nombre}
          fill
          className="object-cover"
        />

        {/* FAVORITO */}
        {producto.favorito && (
          <button
            className="
              absolute
              top-3
              right-3
              w-10
              h-10
              rounded-full
              bg-white/90
              backdrop-blur-md
              flex
              items-center
              justify-center
              shadow-lg
              hover:scale-110
              transition-all
              duration-300
            "
          >
            <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
          </button>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="p-4">
        {/* CATEGORIA */}
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wide">
          {producto.categoria}
        </p>

        {/* NOMBRE */}
        <h2 className="text-lg font-bold text-gray-800 mt-1 line-clamp-1">
          {producto.nombre}
        </h2>

        {/* DESCRIPCION */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 h-10">
          {producto.descripcion}
        </p>

        {/* FOOTER */}
        <div className="mt-5 flex items-center justify-between gap-3">
          {/* PRECIO */}
          <span
            className="
              text-xl
              font-bold
              text-pink-500
              whitespace-nowrap
              flex-shrink-0
            "
          >
            ${producto.precio}
          </span>

          {/* BOTON */}
          <button
            className="
              flex
              items-center
              gap-2
              bg-pink-500
              hover:bg-pink-600
              text-white
              px-3
              py-2
              rounded-full
              shadow-md
              hover:scale-105
              transition-all
              duration-300
              whitespace-nowrap
              flex-shrink-0
            "
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
