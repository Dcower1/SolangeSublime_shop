import type { Producto } from "@/app/components/ProductCard";

export const HOME_PAGE = "Inicio";
export const ALL_PRODUCTS_CATEGORY = "Todos";
export const FAVORITES_CATEGORY = "Favoritos";

export const BASE_CATEGORIES = [
  ALL_PRODUCTS_CATEGORY,
  FAVORITES_CATEGORY,
  "Ofertas",
  "SuperBox",
  "Ropa",
  "Calzado",
  "Accesorios",
  "Maquillaje",
  "Peluches",
  "Otros",
];

export function normalizeCategory(value: unknown) {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function buildCategories(productos: Producto[]) {
  const dataCategories = Array.from(
    new Set(
      productos
        .map((p) => p?.categoria)
        .filter((c): c is string => typeof c === "string" && c.trim() !== "")
    )
  );

  return [
    ...BASE_CATEGORIES,
    ...dataCategories.filter(
      (c) =>
        !BASE_CATEGORIES.some(
          (base) => normalizeCategory(base) === normalizeCategory(c)
        )
    ),
  ];
}

export function filterProductsByCategory(
  productos: Producto[],
  category: string
) {
  const normalizedCategory = normalizeCategory(category);

  if (normalizedCategory === normalizeCategory(ALL_PRODUCTS_CATEGORY)) {
    return productos;
  }

  if (normalizedCategory === normalizeCategory(FAVORITES_CATEGORY)) {
    return productos.filter((producto) => Boolean(producto.favorito));
  }

  return productos.filter(
    (producto) =>
      normalizeCategory(producto?.categoria) === normalizedCategory
  );
}

export function getCategoryHref(category: string) {
  if (normalizeCategory(category) === normalizeCategory(HOME_PAGE)) {
    return "/";
  }

  if (normalizeCategory(category) === normalizeCategory(ALL_PRODUCTS_CATEGORY)) {
    return `/categories/${encodeURIComponent(ALL_PRODUCTS_CATEGORY)}`;
  }

  if (normalizeCategory(category) === normalizeCategory(FAVORITES_CATEGORY)) {
    return `/categories/${encodeURIComponent(FAVORITES_CATEGORY)}`;
  }

  return `/categories/${encodeURIComponent(category)}`;
}

export function resolveCategoryParam(
  categoryParam: string,
  categories: string[]
) {
  const normalizedParam = normalizeCategory(categoryParam);

  if (normalizedParam === normalizeCategory(HOME_PAGE)) {
    return HOME_PAGE;
  }

  return (
    categories.find(
      (category) => normalizeCategory(category) === normalizedParam
    ) ?? null
  );
}

export function filterProductsBySearch(
  productos: Producto[],
  query: string
) {
  const normalizedQuery = normalizeCategory(query);

  if (!normalizedQuery) {
    return productos;
  }

  return productos.filter((producto) => {
    const searchableText = [
      producto.nombre,
      producto.descripcion,
      producto.categoria,
    ]
      .filter(Boolean)
      .join(" ");

    return normalizeCategory(searchableText).includes(normalizedQuery);
  });
}
