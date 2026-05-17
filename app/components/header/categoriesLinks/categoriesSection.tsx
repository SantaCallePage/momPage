import Link from "next/link"
import styles from "./categoriesSection.module.css"

import { getCategories } from "@/lib/server/firebase/firestoreHandler"
import { Category } from "@/models/categories"
import CategoriesContainer from "./categoriesContainer"
import CategoriesSectionContainer from "./CategoriesSectionContainer"
export default async function CategoriesSection(){

    const categories:Category[] = await getCategories()

    
    return (
      <CategoriesSectionContainer categories={categories} />
    )
}