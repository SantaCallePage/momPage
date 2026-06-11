import { Product } from "@/models/product";
import { getAllProducts, getFeaturedProducts,getProductsByCategory,getProductsBySubcategory, getSubCategories } from "@/lib/server/firebase/firestoreHandler"
import ProductGrid from "./components/productsContainers/productGrid";
import ProductsListGrid from "./components/productsContainers/productList";
import HeroSection from "./components/hero/heroSection";
//const querySnapshot2 = await fetch('/api/v1/getData?filterName=Nombre&filterValue=Luca');

export const revalidate = 600;

export default async function Home() {
  
  //const prods:Product[] = await getAllProducts(); 
  const prods:Product[] = await getFeaturedProducts();

  return (
    <main>
      <HeroSection/>
      <h3>Productos Destacados</h3>
      <ProductGrid products={prods}/>
    </main>
  );
}
