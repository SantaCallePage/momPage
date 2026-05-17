import { getAllProducts, getAllSubcategories, getProductById, getProductsBySubcategory } from "@/lib/server/firebase/firestoreHandler";
import ProductGrid from "@/app/components/productsContainers/productGrid";
import { Product } from "@/models/product";
import ProductView from "@/app/components/productView/productView";

export const revalidate = 600;


export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((prod:Product) => ({
    id:prod.id
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{id: string }>;
}) {

    const id = (await params).id;
    const productData:Product = await getProductById(id);

  return (
    <main>
      
      <ProductView product={productData} />
    </main>
  );
}