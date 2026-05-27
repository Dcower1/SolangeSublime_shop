import { supabase } from "@/app/lib/supabase";

export async function uploadImage(
  file: File
) {

  // nombre único
  const safeBaseName =
    file.name
      .replace(/\.[^.]+$/, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
  const extension =
    file.name.split(".").pop() || "jpg";
  const fileName =
    `products/${Date.now()}-${safeBaseName}.${extension}`;

  // subir imagen
  const { error } =
    await supabase.storage
      .from("productos")
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type || undefined,
      });

  if (error) {
    throw error;
  }

  // obtener URL pública
  const {
    data: publicUrlData,
  } = supabase.storage
    .from("productos")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
