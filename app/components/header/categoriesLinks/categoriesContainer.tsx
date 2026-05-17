"use client"
import { Category } from "@/models/categories"
import styles from "./categoriesSection.module.css"
import Link from "next/link";
import { capitalizeAllSentence } from "@/lib/client/generalServices/generalServices";


interface CategoriesContainerProps {
    categories: Category[];
    addToRef(el:HTMLDetailsElement | null):void
}

export default function CategoriesContainer({categories, addToRef}: CategoriesContainerProps) {
   

    return (
        <div className={`${styles.categories_container}`} >
            {categories.map((category: Category) => {
                return <details className={`${styles.details}`} ref={(el) => { addToRef(el) }} key={category.name}>
                    <summary> <Link href={`/category/${category.name.replaceAll(" ", "_")}`}>{ capitalizeAllSentence(category.name)}</Link></summary>
                    <div className={`${styles.subcategories_container}`}>
                        {category.subcategories.map((subcategory: any) => {
                            return <Link key={subcategory} href={`/subcategory/${subcategory.replaceAll(" ", "_")}`}>{capitalizeAllSentence(subcategory)}</Link>
                        })}
                    </div>
                </details>
            })}
        </div>
    )
}