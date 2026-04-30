import { Category } from "@/models/categories"
import styles from "./categoriesSection.module.css"
import Link from "next/link";


interface CategoriesContainerProps{
    categories:Category[];
}

export default function CategoriesContainer(props:CategoriesContainerProps){
    
    const categories = props.categories;
    
    return(
         <div className={`${styles.categories_container}`} >
                    {categories.map((category:Category)=>{
                    return <details key={category.name}>
                        <summary> <Link href={`/category/${category.name.replaceAll(" ","_")}`}>{category.name}</Link></summary>
                        <div className={`${styles.subcategories_container}`}>
                            {category.subcategories.map((subcategory:any)=>{
                        return <Link key={subcategory} href={`/subcategory/${subcategory.replaceAll(" ","_")}`}>{subcategory}</Link>
                        })}
                        </div>
                    </details>
                })}
                </div>
    )
}