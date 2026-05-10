import { Product } from "@/models/product"
import styles from "./productView.module.css"

interface VariansNamesProps{
    product:Product;
    currentVariant:string;
    setCurrentVariant(currentVariant:string):void;
}

export default function VariantsNames({ product, currentVariant, setCurrentVariant }:VariansNamesProps){
    return(
         <div className={`${styles.variants_names_container}`} >
                <span className={`${styles.variants_identifier}`} >Colores:</span>
                {product ? product.variants.map((variant) => {
                    return <button className={`${styles.variant_name}${variant.stock === 0 ? "_disabled" : ""} ${currentVariant === variant.name ? styles.variant_name_selected : ""}${variant.stock === 0 && currentVariant === variant.name ? "_disabled" : ""} `}
                        key={variant.name}
                        onClick={() => { setCurrentVariant(variant.name) }}>{variant.name} {currentVariant === variant.name ? "●" : ""}</button>

                }) : ""}
        </div>
    )
}