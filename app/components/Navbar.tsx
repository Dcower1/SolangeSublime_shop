"use client";

interface NavbarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function Navbar({
  categories,
  selectedCategory,
  setSelectedCategory,
}: NavbarProps) {

  return (

    <nav className="w-full bg-[#333] text-white">

      <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide">

        <ul className="flex items-center justify-center gap-8 py-4">

          {categories.map((category) => (

            <li key={category}>

              <button
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`
                  relative
                  font-medium
                  transition-all
                  duration-300
                  whitespace-nowrap

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

                  ${
                    selectedCategory === category
                      ? "text-pink-500 after:w-full"
                      : "text-white"
                  }
                `}
              >

                {category}

              </button>

            </li>

          ))}

        </ul>

      </div>

    </nav>
  );
}