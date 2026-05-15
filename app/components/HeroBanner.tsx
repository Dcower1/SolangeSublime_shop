import Image from "next/image";

export default function HeroBanner() {
  return (

    <section className="relative w-full overflow-hidden">

      {/* IMAGEN FONDO */}
      <div className="relative h-[250px] md:h-[500px] w-full">

        <Image
          src="/bigbanner.png"
          alt="SolangeSublime Banner"
          fill
          priority
          className="object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

      </div>

      {/* CONTENIDO */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

        <h1 className="text-4xl md:text-7xl font-bold text-white drop-shadow-lg">
          SolangeSublime 
        </h1>

        <p className="mt-4 text-sm md:text-xl text-white max-w-2xl">
          Ropa, accesorios, peluches y dulces con temática anime 
        </p>

        <button
          className="
            mt-6
            bg-pink-500
            hover:bg-pink-600
            text-white
            px-6
            md:px-8
            py-3
            rounded-full
            font-semibold
            shadow-xl
            hover:scale-105
            transition-all
            duration-300
          "
        >
          Ver productos
        </button>

      </div>

    </section>
  );
}