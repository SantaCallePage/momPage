import { getAllProducts,getCategories,getSubCategories } from "@/lib/server/firebase/firestoreHandler";
import ProductGrid from "../components/productsContainers/productGrid";
import AllProductsView from "./allProductsView";

export default async function viewProducts(){
    const products = await getAllProducts()
    products.sort((a, b) => (a.category.localeCompare(b.category) || a.subcategory.localeCompare(b.subcategory)));

   // const categories = new Map<string,string[]>();
    const cat = await getCategories()
    return(
        <main>
            <AllProductsView products={products} categories={cat}/>
        </main>
    )
}