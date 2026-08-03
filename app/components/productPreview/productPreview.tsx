"use client"

import { Product, Variant } from "@/models/product"
import {  useState, useRef, useMemo } from "react"

import Image from "next/image"
import styles from "./productPreview.module.css"
import Link from "next/link"


interface ProductPreviewProps {
    product: Product
}

export default function ProductPreview(prop: ProductPreviewProps) {
    const [product, _] = useState(prop.product);

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    const scrollRef = useRef<HTMLDivElement>(null);

    const { images, totalStock } = useMemo(() => {
        const tempImages = product.variants.map((variant: Variant) => variant.imagesUrls[0])

        const stock = product.variants.reduce((acumulator, currentVariant: Variant) => { return acumulator + currentVariant.stock }, 0);
        return { images: tempImages, totalStock: stock };
    }, [product]);

    function scroll(scroll: number) {
        if (scrollRef.current) {
            // 2. Aplicamos el movimiento
            scrollRef.current.scrollBy({
                left: scroll,
                behavior: 'smooth' // Esto hace que se deslice suavemente
            });
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        // Calculamos qué "página" estamos viendo basándonos en el ancho
        const newIndex = Math.round(target.scrollLeft / target.offsetWidth);

        if (newIndex !== currentImageIndex) {
            setCurrentImageIndex(newIndex)
        }
    };

    return (
        <Link href={`/product/${product.id}`} className={` ${styles.main_container} `}>

            <div className={` ${styles.image_and_buttons_container} `} >
                <button className={`${styles.image_button}`} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); 
                    scroll(-100)
                }} > {"<"} </button>

                <div className="relative w-full">
                    <div ref={scrollRef} onScroll={handleScroll} className={`${styles.images_container}`} >

                        {images.map((url: string, index) => {
                            return <Image
                                key={url} //I'll use the URL as a Key, is this wrong?
                                src={url}
                                className={` ${styles.image} `}
                                alt="Product image"
                                width={500}
                                height={500}
                                priority={index == 0}

                            />

                        })}

                        <div className={`${styles.dots_container}`} >
                            {
                                images.map((url: string, index) => {
                                    return <div key={url + index} className={`${styles.dot} ${index == currentImageIndex ? styles.active_dot : ''}`} ></div>
                                })
                            }

                        </div>

                    </div>
                </div>



                <button className={`${styles.image_button}`} onClick={(e) => {
                    e.preventDefault(); // Evita que el Link intente navegar
                    e.stopPropagation(); // Evita que el clic "suba" al Link
                    scroll(100)
                }} > {">"} </button>
            </div>
            <h5 className={`${styles.name}`} > <b> {product.name} </b> </h5>
            <p className={`${styles.price}`} >  <b> ${product.price} </b> </p>
            <button className={`${styles.buy_button}`} disabled={totalStock === 0 ? true : false} >Ver Producto</button>

        </Link>
    )
}