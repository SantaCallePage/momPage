"use client"

import { Product, Variant } from "@/models/product"
import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "./productPreview.module.css"


interface ProductPreviewProps{
    product : Product
}

export default function ProductPreview(prop : ProductPreviewProps){
    const product = prop.product
    

    

    const [currentImageUrl,setCurrentImageUrl] = useState<string>("")
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    const [images,setImages] = useState<string[]>([])
    const [totalStock, setTotalStock] = useState<number>(0)

    useEffect(()=>{
        if(product){
            const tempImages = product.variants.map((variant:Variant)=>variant.imagesUrls[0])
            setImages(tempImages)
            const stock = product.variants.reduce((acumulator,currentVariant:Variant)=>{ return acumulator + currentVariant.stock},0)
            setTotalStock(stock)

        }
    },[product])

    useEffect(()=>{
        if(images.length > 0){
            setCurrentImageUrl(images[0])
        }
    },[images])

    useEffect(()=>{
        setCurrentImageUrl(images[currentImageIndex])
    },[currentImageIndex])

    return (
        <a href="#" className={` ${styles.main_container} `}>

            

            <div className={` ${styles.image_and_buttons_container} `} > 
                <button className={`${styles.image_button}`} onClick={()=>{
                    if(currentImageIndex > 0){
                        setCurrentImageIndex(currentImageIndex - 1)
                    }
                }} > {"<"} </button>
                {currentImageUrl && (<Image
                    src={currentImageUrl}
                    className={` ${styles.image} `}
                    alt="Product image"
                    width={500}
                    height={500}
                    
                />)}
                <button className={`${styles.image_button}`} onClick={()=>{
                    if(currentImageIndex < images.length-1){
                        setCurrentImageIndex(currentImageIndex + 1)
                    }
                }} > {">"} </button>
            </div>
                <h5 className={`${styles.name}`} > <b> {product.name} </b> </h5>
                <p className={`${styles.price}`} >  <b> ${product.price} </b> </p>
            <button className={`${styles.buy_button}`} disabled={totalStock === 0 ? true : false} onClick={()=>{console.log("Listo, son $1000000000000 Dolares")}} >Agregar al carrito {}</button>

        </a>
    )
}