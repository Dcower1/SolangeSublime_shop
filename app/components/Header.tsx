import Image from "next/image";

import {
  User,
  Heart,
  ShoppingCart
} from "lucide-react";

export default function Header() {

  return (

    <header className="w-full h-[71px] bg-white border-b border-pink-100 shadow-sm">

        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

            {/* LOGO */}
            <div className="flex items-center">
            <Image
                src="/logo.png"
                alt="SolangeSublime"
                width={110}
                height={110}
                className="object-contain"
            />
            </div>

            {/* MENU */}
            <nav>
            <ul className="flex items-center gap-8">

                <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-all duration-300">
                    <User className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
                    <span className="text-sm font-medium">Iniciar sesión</span>
                </a>
                </li>

                <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-all duration-300">
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
                    <span className="text-sm font-medium">Favoritos</span>
                </a>
                </li>

                <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-all duration-300">
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
                    <span className="text-sm font-medium">Carrito</span>
                </a>
                </li>

            </ul>
            </nav>

        </div>
    </header>
  );
}