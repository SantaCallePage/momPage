"use client"
import styles from "./categoriesSection.module.css"

import { Category } from "@/models/categories"
import CategoriesContainer from "./categoriesContainer"
import { useEffect, useRef } from "react"

import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react";

interface CategoriesSectionProps {
    categories: Category[]
}

export default function CategoriesSectionContainer({ categories }: CategoriesSectionProps) {

    const detailsRefs = useRef<Array<HTMLDetailsElement | null>>([]);

    const addToRef = (el: HTMLDetailsElement | null) => {
        if (el) {
            detailsRefs.current.push(el)
            //return detailsRefs.current[i];
        }
    }

    useEffect(() => {
        console.log(detailsRefs)
        // Solo declaramos el evento si el componente está montado
        const handleClickOutside = (e: MouseEvent) => {
            console.log("Evento");
            for (let i = 0; i < detailsRefs.current.length; i++) {
                console.log(`TABIERTO ${i} ${detailsRefs.current[i]?.open}`);
                if (detailsRefs.current[i]?.open && !detailsRefs.current[i]?.contains(e.target as Node)) {
                    //  alert("CLICK AFUERA");
                    detailsRefs.current[i]!.open = false
                    // Al ser un ref directo al DOM, podés setear .open = false
                    // sin necesidad de un estado extra si solo querés cerrarlo.
                }
            }
        }

        const handleScroll = (e: Event) => {
            for (let i = 0; i < detailsRefs.current.length; i++) {
                console.log(`SCROLL ${i} ${detailsRefs.current[i]?.open}`);
                if (detailsRefs.current[i]?.open) {

                    detailsRefs.current[i]!.open = false
                }
            }
        }

        document.addEventListener('click', handleClickOutside)
        window.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('click', handleClickOutside)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])


    return (
        <div className={`${styles.main_container}`}  >
            <AnimatePresence>

                <motion.details key={0}
                    className={`${styles.ham_menu} ${styles.details}`}
                    ref={el => addToRef(el)}
                    initial={{opacity:0}}
                        animate={{opacity:1}}
                        exit={{opacity:0}}
                        transition={{duration:1}}
                >

                    <summary>Explorar</summary>
                    <motion.div
                        
                    >
                        <CategoriesContainer categories={categories} addToRef={addToRef} />
                        <div className={`${styles.fade}`} ></div>
                    </motion.div>
                </motion.details>
                <div className={`${styles.desk_menu}`} key={1}>
                    <CategoriesContainer categories={categories} addToRef={addToRef} />
                    <div className={`${styles.fade}`} ></div>
                </div>
            </AnimatePresence>
        </div>
    )
}