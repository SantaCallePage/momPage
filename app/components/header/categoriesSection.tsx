import styles from "./categoriesSection.module.css"

import { getAllCategories } from "@/lib/client/categories/categoriesHandler"
import SubcategoryButton from "./subcategorybutton"

export default async function CategoriesSection(){

    const categories = await getAllCategories()

    function callback(data:string):void{
        alert(`La subcategoría ${data} fué clikiada`);
    }

    console.log(`categorias`)
    console.table(categories)
    return (
        <details className={`${styles.main_container}`} >
            <summary>Explorar</summary>
            <div className={`${styles.categories_container}`} >
                 {categories.map((category:any)=>{
                return <details key={category.name}>
                    <summary>{category.name}</summary>
                    <div className={`${styles.subcategories_container}`}>
                        {category.subcategories.map((subcategory:any)=>{
                       return <SubcategoryButton key={subcategory} subcategoryName={subcategory} onSubcategoryClicked={callback} />
                    })}
                    </div>
                </details>
            })}
            </div>
            <div className={`${styles.fade}`} ></div>
        </details>
    )
}