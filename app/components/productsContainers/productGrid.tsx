//"use client" //Si es necesario lo hacemos un client component. Pero en lo posible lo hacemos server component

import { Product } from "@/models/product";
import ProductPreview from "../productPreview/productPreview";
import styles from "./productGrid.module.css"


interface productListProps{
    products:Product[]
}

export default function ProductGrid(prop:productListProps){

    const products:Product[] = prop.products

    return(
        <div className={` ${styles.products_container} `} >{
          products.map((product:Product)=>{
            return <ProductPreview key={product.id} product={product} />
          })
        }</div>
    )

}