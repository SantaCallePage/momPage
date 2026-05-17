import { getCategories, getProductsByCategory, getSubCategories } from "@/lib/server/firebase/firestoreHandler";
import ProductGrid from "@/app/components/productsContainers/productGrid";
import { Category } from "@/models/categories";
import { Product } from "@/models/product";
import ProductsListGrid from "@/app/components/productsContainers/productList";
import { capitalizeAllSentence } from "@/lib/client/generalServices/generalServices";

export const revalidate = 600;

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((cat: Category) => ({
    category: cat.name,
  }));
}


export default async function CategoryPage({
  params,
}: {
  params: Promise<{category: string }>;
}) {

    const category = (await params).category;
    const subcategories = await getSubCategories(category);
    const categoryProds = await getProductsByCategory(category.replaceAll("_"," "),subcategories.map((s)=>s.replaceAll("_"," ")));
    const categoryProdsGrouped = new Map<string,Product[]>();
    for (const p of categoryProds){
      if(!categoryProdsGrouped.has(p.subcategory)){
        categoryProdsGrouped.set(p.subcategory,[])
      }
      categoryProdsGrouped.get(p.subcategory)?.push(p);
    }

  return (
    <main>
      <h2>{ capitalizeAllSentence(category)}</h2>
      {subcategories.map((subcategory:string)=>{
              //const subcategoryProducts = categoryProds.filter((p:Product)=>p.subcategory === subcategory);
              return <ProductsListGrid key={`${category}+${subcategory}`} 
              name={subcategory}
               type="subcategory"
               products={categoryProdsGrouped.get(subcategory)!} />
            })}
    </main>
  );
}