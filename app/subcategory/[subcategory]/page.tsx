import { getAllSubcategories, getProductsBySubcategory } from "@/lib/server/firebase/firestoreHandler";
import ProductGrid from "@/app/components/productsContainers/productGrid";
import { capitalizeAllSentence } from "@/lib/client/generalServices/generalServices";
import styles from "./subcategoryPage.module.css"

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

    const subcategory = (await params).subcategory.replaceAll("_"," ");
  const products = await getProductsBySubcategory(subcategory.replaceAll("_"," "));
    const sc = await getAllSubcategories();

  return (
    <main className={`${styles.main_container}`} >
      <h2>{capitalizeAllSentence(subcategory)}</h2>
      <ProductGrid products={products} />
    </main>
  );
}