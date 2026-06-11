"use client"
import styles from "./categoriesSection.module.css"

import { Category } from "@/models/categories"
import CategoriesContainer from "./categoriesContainer"
import { useEffect, useRef } from "react"

import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react";
import { SquareChevronDown, SquareChevronUp } from "lucide-react"
import DropDownDetails from "./dropDownDetails"

interface CategoriesSectionProps {
    categories: Category[]
}

export default function CategoriesSectionContainer({ categories }: CategoriesSectionProps) {

    return (
        <div className={`${styles.main_container}`}  >
            <AnimatePresence>

                <div className={styles.ham_menu}>
                    <DropDownDetails isAbsolute={true} summaryText={"Explorar tienda"}>
                        <motion.div

                        >
                            <CategoriesContainer categories={categories} isAbsolute={false} />
                            
                        </motion.div>
                    </DropDownDetails>
                </div>

                <div className={`${styles.desk_menu}`} key={1}>
                    <CategoriesContainer categories={categories} isAbsolute={true}/>
                   
                </div>
            </AnimatePresence>
        </div>
    )
}
