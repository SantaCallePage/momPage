"use client"
import { Category } from "@/models/categories"
import styles from "./categoriesSection.module.css"
import Link from "next/link";
import { capitalizeAllSentence } from "@/lib/client/generalServices/generalServices";
import { ArrowUpRight } from "lucide-react";
import DropDownDetails from "./dropDownDetails";

interface CategoriesContainerProps {
    categories: Category[];
    isAbsolute:boolean
}

export default function CategoriesContainer({categories, isAbsolute}: CategoriesContainerProps) {
   

    return (
        <div className={`${styles.categories_container}`} >
            {categories.map((category: Category) => {
                return <DropDownDetails key={category.name} isAbsolute={isAbsolute} summaryHref={`/category/${category.name.replaceAll(" ", "_")}`}  summaryText={capitalizeAllSentence(category.name)} >
                    <div className={`${styles.subcategories_container}`}>
                        {category.subcategories.map((subcategory: any) => {
                            return <Link className={`${styles.link}`} key={subcategory} href={`/subcategory/${subcategory.replaceAll(" ", "_")}`}><span>{capitalizeAllSentence(subcategory)}</span> <ArrowUpRight/> </Link>
                        })}
                    </div>
                </DropDownDetails>
            })}
        </div>
    )
}