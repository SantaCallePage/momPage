import Link from "next/link"
import styles from "./categoriesSection.module.css"

import { getCategories } from "@/lib/server/firebase/firestoreHandler"
import { Category } from "@/models/categories"

export default async function CategoriesSection(){

    const categories:Category[] = await getCategories()

    //console.log(`categorias`)
    //console.table(categories)
    return (
        <details className={`${styles.main_container}`} >
            <summary>Explorar</summary>
            <div className={`${styles.categories_container}`} >
                 {categories.map((category:Category)=>{
                return <details key={category.name}>
                    <summary> <Link href={`/?category=${category.name}`}>{category.name}</Link></summary>
                    <div className={`${styles.subcategories_container}`}>
                        {category.subcategories.map((subcategory:any)=>{
                       return <Link key={subcategory} href={`/?subcategory=${subcategory}`}>{subcategory}</Link>
                    })}
                    </div>
                </details>
            })}
            </div>
            <div className={`${styles.fade}`} ></div>
        </details>
    )
}