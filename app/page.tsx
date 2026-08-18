import { Product } from "@/models/product";
import { getNew } from "@/lib/server/firebase/firestoreHandler"
import ProductGrid from "./components/productsContainers/productGrid";
import HeroSection from "./components/hero/heroSection";

export const revalidate = 600;

export default async function Home() {
  
  const prods:Product[] = await getNew();

  return (
    <main>
      <HeroSection />
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 pt-10 pb-2">
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-zinc-900 m-0">
          Últimos Ingresos
        </h2>
      </div>
      <ProductGrid products={prods} />
    </main>
  );
}
