import Link from "next/link"
import styles from "./categoriesSection.module.css"

import { getCategories } from "@/lib/server/firebase/firestoreHandler"
import { Category } from "@/models/categories"
import CategoriesContainer from "./categoriesContainer"
export default async function CategoriesSection(){

    const categories:Category[] = await getCategories()

    //console.log(`categorias`)
    //console.table(categories)
    return (
        <div className={`${styles.main_container}`}  >
            <details className={`${styles.ham_menu}`} >
                <summary>Explorar</summary>
                <CategoriesContainer categories={categories} />
                <div className={`${styles.fade}`} ></div>
            </details>
            <div className={`${styles.desk_menu}`} >
                <CategoriesContainer categories={categories} />
                <div className={`${styles.fade}`} ></div>
            </div>
        </div>
    )
}