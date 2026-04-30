import { getAllSubcategories, getProductsBySubcategory } from "@/lib/server/firebase/firestoreHandler";
import ProductGrid from "@/app/components/productsContainers/productGrid";

export const revalidate = 600;


export async function generateStaticParams() {
  const subcategories = await getAllSubcategories();

  return subcategories.map((sub: string) => ({
    subcategory: sub,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{subcategory: string }>;
}) {

    const subcategory = (await params).subcategory;
  const products = await getProductsBySubcategory(subcategory.replaceAll("_"," "));
    const sc = await getAllSubcategories();

  return (
    <main>
      <h2>{subcategory}</h2>
      <ProductGrid products={products} />
    </main>
  );
}