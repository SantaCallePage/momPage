"use client"
import { Product } from "@/models/product";
import ProductGrid from "../components/productsContainers/productGrid";
import { useEffect, useMemo, useState } from "react";
import Filter from "./filter"
import { Category } from "@/models/categories";
import styles from "./productsView.module.css"; // Importamos los estilos acá también

interface AllProductsViewProps {
    products: Product[];
    categories: Category[];
}

export default function AllProductsView({ products, categories }: AllProductsViewProps) {
    const [category, setCategory] = useState<string | null>(null);
    const [subcategory, setSubcategory] = useState<string | null>(null);
    const [filtredProducts, setFiltredProducts] = useState<Product[]>(products);
    const featured = useMemo<Product[]>(()=>{
        return products.filter(p => p.featured)
    },[])

    useEffect(() => {
        if(category == null) {
            setSubcategory(null)
        }
        setFiltredProducts(() => {
            if (category && subcategory)
                return products.filter(p => p.category === category && p.subcategory === subcategory)

            if (category)
                return products.filter(p => p.category === category)

            if (subcategory)
                return products.filter(p => p.subcategory === subcategory)

            return products
        })
    }, [category, subcategory])

    const setSelectedOption = (
        newOption: string,
        currentOption: string | null,
        setter: (option: string | null) => void
    ) => {
        setter(newOption === currentOption ? null : newOption);
    };

    const setSelectedCategory = (categorySelected: string) => {
        setSelectedOption(categorySelected, category, setCategory)
    }

    const setSelectedSubcategory = (sucategorySelected: string) => {
        setSelectedOption(sucategorySelected, subcategory, setSubcategory)
    }

    return (
        <div>
            {/* Seccion superior de Filtros Estilizada */}
            <section className={styles.filter_header}>
            
                <h1 className={styles.title_text}>
                    {category ? category : "Todos"}
                    {subcategory && (
                        <>
                            <span className={styles.title_separator}>›</span>
                            {subcategory}
                        </>
                    )}
                </h1>
                
                {/* Selector de Categorías */}
                <Filter 
                    options={categories.map((c) => c.name)} 
                    selectedOptionSetter={setSelectedCategory} 
                    currentOption={category} 
                />
                
                {/* Selector de Subcategorías Dinámico */}
                {category && (
                    <Filter 
                        options={categories.filter(c => c.name === category)[0].subcategories} 
                        selectedOptionSetter={setSelectedSubcategory} 
                        currentOption={subcategory} 
                    />
                )}
            </section>

            <section>
                { !category ? <p className="font-black p-10 text-xxxl">Destacados</p> : ""}
                { !category ? <ProductGrid products={featured} /> : ""}
                { !category ? <p className="font-black p-10 font-xl">Todos los Productos</p> : ""}
                <ProductGrid products={filtredProducts} />
            </section>
        </div>
    )
}