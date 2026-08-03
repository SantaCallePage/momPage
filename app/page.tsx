import { Product } from "@/models/product";
import { getNew } from "@/lib/server/firebase/firestoreHandler"
import ProductGrid from "./components/productsContainers/productGrid";
import HeroSection from "./components/hero/heroSection";

export const revalidate = 600;

export default async function Home() {
  
  const prods:Product[] = await getNew();

  return (
    <main>
      <HeroSection/>
      <h3 className="font-black text-5xl m-4">Ultimos Ingresos</h3>
      <ProductGrid products={prods}/>
    </main>
  );
}
