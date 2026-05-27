"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import {
  Loader2,
  Lock,
  LogOut,
  PencilLine,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

import { type Producto } from "@/app/components/ProductCard";
import { buildCategories } from "@/app/lib/catalog";
import { supabase } from "@/app/lib/supabase";
import { uploadImage } from "@/app/service/uploadImage";

type ProductFormState = {
  nombre: string;
  descripcion: string;
  precio: string;
  imagen_url: string;
  categoria: string;
  favorito: boolean;
  stock: string;
};

const EMPTY_FORM: ProductFormState = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen_url: "",
  categoria: "",
  favorito: false,
  stock: "",
};

export default function AdminPage() {
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [products, setProducts] = useState<Producto[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const categories = useMemo(
    () => buildCategories(products).filter((category) => category !== "Favoritos"),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) return products;

    return products.filter((product) => {
      const haystack = [
        product.nombre,
        product.descripcion,
        product.categoria,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedTerm);
    });
  }, [products, searchTerm]);

  const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError("");

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setProductsError(error.message);
      setProducts([]);
    } else {
      setProducts((data || []) as Producto[]);
    }

    setProductsLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setIsAuthenticated(Boolean(data.session));
      setSessionReady(true);

      if (data.session) {
        await loadProducts();
      }
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setIsAuthenticated(Boolean(currentSession));

      if (currentSession) {
        await loadProducts();
      } else {
        setProducts([]);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setSelectedFile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    }

    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSelectedFile(null);
  };

  const handleEdit = (product: Producto) => {
    setEditingId(product.id);
    setForm({
      nombre: product.nombre ?? "",
      descripcion: product.descripcion ?? "",
      precio: String(product.precio ?? ""),
      imagen_url: product.imagen_url ?? "",
      categoria: product.categoria ?? "",
      favorito: Boolean(product.favorito),
      stock: product.stock === null || product.stock === undefined ? "" : String(product.stock),
    });
    setSelectedFile(null);
    setStatusMessage("");
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Eliminar este producto?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("productos").delete().eq("id", id);

    if (error) {
      setProductsError(error.message);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    await loadProducts();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatusMessage("");
    setProductsError("");

    try {
      const nextImageUrl = selectedFile
        ? await uploadImage(selectedFile)
        : form.imagen_url.trim();

      if (!nextImageUrl) {
        throw new Error("Debes subir una imagen o pegar una URL valida.");
      }

      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        imagen_url: nextImageUrl,
        categoria: form.categoria.trim(),
        favorito: form.favorito,
        stock: form.stock.trim() ? Number(form.stock) : null,
      };

      if (!payload.nombre || !payload.descripcion || !payload.categoria || !Number.isFinite(payload.precio)) {
        throw new Error("Completa nombre, descripcion, precio y categoria correctamente.");
      }

      if (editingId) {
        const { error } = await supabase
          .from("productos")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
        setStatusMessage("Producto actualizado.");
      } else {
        const { error } = await supabase.from("productos").insert(payload);

        if (error) throw error;
        setStatusMessage("Producto creado.");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : "Error inesperado.");
    } finally {
      setSaving(false);
    }
  };

  if (!sessionReady) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto flex max-w-md items-center justify-center rounded-3xl bg-white p-8 shadow-xl">
          <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-pink-400">
              Panel admin
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Acceso privado
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Inicia sesion con Supabase Auth para administrar productos.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
                placeholder="admin@correo.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
                placeholder="********"
                required
              />
            </div>

            {authError && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-pink-400">
              Panel admin
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Productos
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              CRUD, subida de imagenes y favoritos.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Inventario
                </h2>
                <p className="text-sm text-gray-500">
                  {products.length} productos registrados
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar en inventario"
                  className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-pink-300"
                />
              </div>
            </div>

            {productsError && (
              <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {productsError}
              </p>
            )}

            {productsLoading ? (
              <div className="py-12 text-center text-gray-500">
                Cargando productos...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
                No hay productos para mostrar.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col gap-4 rounded-3xl border border-gray-100 p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="relative h-24 w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-20 sm:w-20">
                      <Image
                        src={product.imagen_url}
                        alt={product.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="truncate font-bold text-gray-900">
                            {product.nombre}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.categoria}
                          </p>
                        </div>

                        <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">
                          ${product.precio}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {product.descripcion}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-pink-200 px-4 py-3 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-50"
                      >
                        <PencilLine className="h-4 w-4" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Borrar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Editar producto" : "Nuevo producto"}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingId ? "Actualiza los datos del producto." : "Carga un producto nuevo."}
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  value={form.nombre}
                  onChange={(event) => setForm({ ...form, nombre: event.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Descripcion
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
                  className="min-h-[110px] w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Precio
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.precio}
                    onChange={(event) => setForm({ ...form, precio: event.target.value })}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) => setForm({ ...form, stock: event.target.value })}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <input
                  list="product-categories"
                  value={form.categoria}
                  onChange={(event) => setForm({ ...form, categoria: event.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
                  required
                />
                <datalist id="product-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Imagen URL
                </label>
                <input
                  value={form.imagen_url}
                  onChange={(event) => setForm({ ...form, imagen_url: event.target.value })}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
                  placeholder="Pega una URL si no quieres subir archivo"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Subir imagen
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 px-4 py-4">
                  <Upload className="h-5 w-5 text-pink-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                    className="w-full text-sm text-gray-600"
                  />
                </div>
                {selectedFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.favorito}
                  onChange={(event) => setForm({ ...form, favorito: event.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-400"
                />
                <span className="text-sm font-medium text-gray-700">
                  Marcar como favorito
                </span>
              </label>

              {statusMessage && (
                <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {statusMessage}
                </p>
              )}

              {productsError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {productsError}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  <PencilLine className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {editingId ? "Guardar cambios" : "Crear producto"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
