export default function Navbar() {

  const categories = [
    "Ofertas",
    "SuperBox",
    "Ropa",
    "Calzado",
    "Accesorios",
    "Maquillaje",
    "Peluches",
    "Otros"
  ];

  return (

    <nav className="w-full bg-white border-b border-pink-100">
      <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
        <ul className="flex items-center justify-center gap-8 py-4">
          {categories.map((category) => (

            <li key={category}> <a href="#"
                className="
                  relative
                  text-gray-600
                  font-medium
                  hover:text-pink-500
                  transition-all
                  duration-300

                  after:content-['']
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:w-0
                  after:h-[2px]
                  after:bg-pink-500
                  after:transition-all
                  after:duration-300

                  hover:after:w-full
                "
              >

                {category}

              </a>

            </li>

          ))}

        </ul>

      </div>

    </nav>
  );
}