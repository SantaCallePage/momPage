import { Product } from "@/models/product";
import { getAllProducts, getFeaturedProducts,getProductsByCategory,getProductsBySubcategory, getSubCategories } from "@/lib/server/firebase/firestoreHandler"
import ProductGrid from "./components/productsContainers/productGrid";
import ProductsListGrid from "./components/productsContainers/productList";
//const querySnapshot2 = await fetch('/api/v1/getData?filterName=Nombre&filterValue=Luca');

export const revalidate = 600;

export default async function Home({ 
 searchParams 
}: { 
  searchParams: Promise<{ subcategory?: string, category?:string }> 
}) {
  //const data: Product[] = await getAllProducts();
  const data: Product[] = [];
  //Con esto puedo renderizar la subcategoría seleccionada por el usuario todo en SSR, TODO DO IT XD
  const { subcategory, category } = await searchParams;
  
  var subcategoryProds:Product[] = [];
  var subcategories:string[] = [];
  var categoryProds:Product[] = [];
  const categoryProdsGrouped = new Map<string,Product[]>();
  if(category){
    subcategories = await getSubCategories(category);
    categoryProds = await getProductsByCategory(category,subcategories);

    for (const p of categoryProds){
      if(!categoryProdsGrouped.has(p.subcategory)){
        categoryProdsGrouped.set(p.subcategory,[])
      }
      categoryProdsGrouped.get(p.subcategory)?.push(p);
    }
    
  } else if (subcategory){
    subcategoryProds = await getProductsBySubcategory(subcategory);
  } else{
    subcategoryProds = await getFeaturedProducts();
  }

  


  return (
    <main>
      <br/><br/>
      {(categoryProds.length > 0) ? 
      subcategories.map((subcategory:string)=>{
        //const subcategoryProducts = categoryProds.filter((p:Product)=>p.subcategory === subcategory);
        return <ProductsListGrid key={`${category}+${subcategory}`} 
        name={subcategory}
         type="subcategory"
         products={categoryProdsGrouped.get(subcategory)!} />
      })
      :""}
      { (subcategoryProds.length > 0) ? <ProductGrid products={subcategoryProds}/> : "" }

      <h3>ALL PRODUCTS</h3>
      <ProductGrid products={data} />
    </main>
  );
}
