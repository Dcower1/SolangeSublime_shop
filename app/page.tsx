import { supabase } from "@/app/lib/supabase";
import ShopPage from "@/app/components/ShopPage";

export default async function Home() {

  const { data: productos } = await supabase
    .from("productos")
    .select("*");

  return (
    <ShopPage productos={productos || []} />
  );
}