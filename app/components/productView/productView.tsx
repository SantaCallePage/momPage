"use client"

import { Product } from "@/models/product";
import styles from "./productView.module.css"
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/app/contexts/cartContext";
import BuyButton from "./buyButton";
import VariantsNames from "./variantsNames";
import PreviewsContainer from "./previewsContainer";
import Carrousel from "./carousel";
import { setDecimalDots, sortProduct } from "@/lib/client/productView/productViewServices";

interface productViewProps {
    product: Product;
}

export default function ProductView(props: productViewProps) {
    const [product, _] = useState<Product>(sortProduct(props.product));
    const [currentVariant, setCurrentVariant] = useState<string>(product.variants[0].name);
    const [currentVariantStock, setCurrentVariantStock] = useState<number>(0);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const scrollRef = useRef<HTMLDivElement>(null);

    //images:{variantName : [urls,of,images]} groups:{variant:name : [[4,urls,images],[another,4,urls,images]]}
    const [images, groups] = useMemo<[Map<string, string[]>, Map<string, string[][]>]>(() => {
        const imgs = new Map<string, string[]>();

        for (const sc of product.variants) {
            imgs.set(sc.name, sc.imagesUrls);
        }

        const groupsImages = new Map<string, string[][]>();
        for (const sc of product.variants) {
            groupsImages.set(sc.name, []);
            let bucket = -1;
            for (let i = 0; i < imgs!.get(sc.name)!.length; i++) {
                if (i % 4 == 0) {
                    groupsImages.get(sc.name)?.push([]);
                    bucket += 1;
                }
                groupsImages.get(sc.name)![bucket]!.push(imgs!.get(sc.name)![i]);

            }
        }

        return [imgs, groupsImages];
    }, [product])

    useEffect(() => {
        for (let variant of product.variants) {
            if (variant.name === currentVariant) {
                setCurrentVariantStock(variant.stock);
                break;
            }
        }
    }, [currentVariant]);

    return (
        <div className={`${styles.main_container}`}>

            <Carrousel scrollRef={scrollRef} currentImageIndex={currentImageIndex} currentVariant={currentVariant} setCurrentImageIndex={setCurrentImageIndex} images={images} />

            <PreviewsContainer groups={groups} currentImageIndex={currentImageIndex} currentVariant={currentVariant} scrollRef={scrollRef} />

            <VariantsNames setCurrentVariant={setCurrentVariant} currentVariant={currentVariant} product={product} />

            <div className={`${styles.name_price_container}`}>
                <span className={`${styles.name}`}>{product.name} {currentVariant}</span>

                <div className={`${styles.description}`} >
                    Una cartera funcional, ideal para salidas, casual, re está en onda. Medidas: 10cm x 15cm x 20cm
                </div>

                <div className={`${styles.price_container}`}>
                    <div className={`${styles.price_discount_container}`}>

                        <span className={`${styles.discount_price} ${!product.discountPercentage ? "hidden" : ""}`} >${(product.price - product.price * product.discountPercentage / 100) * quantity}</span>
                        <span className={`${styles.price} ${product.discountPercentage ? styles.base_price_discount : ""} `}>${setDecimalDots(`${product.price * quantity}`)}</span>

                    </div>
                    <span className={`${styles.discount_tag} ${!product.discountPercentage ? "hidden" : ""}`} >-{product.discountPercentage}%</span>

                </div>
            </div>
            <div className={`${styles.buy_section}`}>

                <div className={`${styles.quantity_container}`}>
                    <span className={`${styles.quantity_label}`} >Cantidad: </span>
                    <button className={`${styles.quantity_button}`} onClick={() => setQuantity(Math.max(quantity - 1, 1))} >{"−"}</button>
                    <span className={`${styles.quantity_box}`} >{quantity}</span>
                    <button className={`${styles.quantity_button}`} onClick={() => setQuantity(quantity + 1)} >{"+"}</button>
                </div>
                <BuyButton currentVariant={currentVariant} currentVariantStock={currentVariantStock} quantity={quantity} id={product.id} />
            </div>
        </div>
    )
}