"use client"

import { Product, Variant } from "@/models/product";
import styles from "./productView.module.css"
import { useEffect, useRef, useState } from "react";
import Image from "next/image"

interface productViewProps{
    product:Product;
}

export default function ProductView(props:productViewProps){
    const [product,_] = useState<Product>(sortProduct(props.product));
    //{variantName : [urls,of,images]}
    const [images, setImages] = useState<Map<string,string[]>>();
    const [currentVariant, setCurrentVariant] = useState<string>("");
    const [currentVariantStock,setCurrentVariantStock] = useState<number>(0);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    //{variant:name : [[4,urls,images],[another,4,urls,images]]}
    const [groups,setGroups] =  useState<Map<string,string[][]>>();
    const [quantity, setQuantity] = useState<number>(1);


    function sortProduct(product:Product):Product{
        product.variants = sortVariants(product.variants);
        return product;
    }

    function sortVariants(variants:Variant[]):Variant[]{
        
    if (variants.length <= 1) {
        return variants;
    }

    // Elegimos un pivote (en este caso, el último elemento)
    const pivot:Variant = variants[variants.length - 1];
    const left: Variant[] = [];
    const right: Variant[] = [];

    for (let i = 0; i < variants.length - 1; i++) {
        if (variants[i].stock > pivot.stock) {
        left.push(variants[i]);
        } else {
        right.push(variants[i]);
        }
    }

    
    return [...sortVariants(left), pivot, ...sortVariants(right)];
    }

    useEffect(()=>{
        if (product){
            const imgs = new Map<string,string[]>();

            for(const sc of product.variants){
                imgs.set(sc.name,sc.imagesUrls);
            }

            setImages(imgs);

            const groupsImages = new Map<string,string[][]>();
            for(const sc of product.variants){
                groupsImages.set(sc.name,[]);
                let bucket = -1;
                for(let i = 0; i<imgs!.get(sc.name)!.length; i++){
                    if(i % 4 == 0){
                        groupsImages.get(sc.name)?.push([]);
                        bucket+=1;
                    }
                    groupsImages.get(sc.name)![bucket]!.push(imgs!.get(sc.name)![i]);

                }
            }

           setGroups(groupsImages);
           console.log(groupsImages);
            
        }

    },[]);

    useEffect(()=>{
        setCurrentVariant(product.variants[0].name); //At first shows the first variant
    },[images]);


       const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        
        const newIndex = Math.round(target.scrollLeft / target.offsetWidth);
        
        if (newIndex !== currentImageIndex) {
            setCurrentImageIndex(newIndex)
        }
        };
        const scrollRef = useRef<HTMLDivElement>(null);
            function scroll(scroll:number){
            if (scrollRef.current) {
        // 2. Aplicamos el movimiento
        scrollRef.current.scrollBy({
            left: scroll,
            behavior: 'smooth' // Esto hace que se deslice suavemente
        });
        }
    }

    useEffect(()=>{
        for(let variant of product.variants){
            if(variant.name === currentVariant){
                setCurrentVariantStock(variant.stock);
                break;
            }
        }
    },[currentVariant]);

    function setDecimalDots(price: string) {
        let reverse: string = price.split("").reverse().join("");
        let conPuntos = "";

        for (let i = 0; i < reverse.length; i++) {
            if (i > 0 && i % 3 === 0) {
                conPuntos += ".";
            }
            conPuntos += reverse[i];
        }

        return conPuntos.split("").reverse().join("");
    }

    return(
    <div className={`${styles.main_container}`}>
        <div className={`${styles.images_dots_container}`}>
            <div className={`${styles.images_container} ${styles.scroll_container}`} ref={scrollRef} onScroll={handleScroll} >{currentVariant ? 
         images?.get(currentVariant)?.map((url)=>{
            return <Image 
            className={`${styles.image} ${styles.scroll_child}`}
            key={url}
            src={url}
            alt="Product image"
            width={500}
            height={500}
            />
         })
         : "" }</div>
         <div className={`${styles.dots_container}`} >
                    {
                        images?.get(currentVariant)?.map((url:string,index)=>{
                            return <div key={url + index} className={`${styles.dot} ${index == currentImageIndex ? styles.active_dot : ''}`} ></div>
                        })
                    }
            </div>
        </div>
        <div className={`${styles.previews_container} ${styles.scroll_container}`} >
            {currentVariant ? 
         groups?.get(currentVariant)?.map((group:string[],i:number)=>{
            return <div key={`YaNoSeMeOcurrenKeys${group[0]}`} className={`${styles.previews_group} ${styles.scroll_child}`} >
               { group.map((url, j:number)=>{
                return <Image 
            className={`${styles.image} cursor-pointer`}
            key={url + url}
            src={url}
            alt="Product image"
            width={500}
            height={500}
            onClick={(e)=>{
                    const move = ((i*4 + j)-currentImageIndex)*scrollRef.current?.offsetWidth!;
                    scroll(move)
                }}
            />
               })}
            </div>
         })
         : "" }
        </div>
        
        <div className={`${styles.variants_names_container}`} >
           <span className={`${styles.variants_identifier}`} >Colores:</span> 
            {product ? product.variants.map((variant)=>{
            return <button className={`${styles.variant_name}${variant.stock===0 ? "_disabled":""} ${currentVariant === variant.name ? styles.variant_name_selected : ""}${variant.stock===0&&currentVariant === variant.name ? "_disabled":""} `} 
            key={variant.name}
            onClick={()=>{setCurrentVariant(variant.name)}}>{variant.name} {currentVariant === variant.name ? "●" : ""}</button>

        }) : ""}</div>
        <div className={`${styles.name_price_container}`}>
            <span className={`${styles.name}`}>{product.name} {currentVariant}</span>

            <div className={`${styles.description}`} >
                 Una cartera funcional, ideal para salidas, casual, re está en onda. Medidas: 10cm x 15cm x 20cm
            </div>

            <div className={`${styles.price_container}`}>
                <div className={`${styles.price_discount_container}`}>    
                
                    <span className={`${styles.discount_price} ${ !product.discountPercentage ? "hidden":""}`} >${(product.price - product.price*product.discountPercentage/100) * quantity}</span>
                    <span className={`${styles.price} ${ product.discountPercentage ? styles.base_price_discount:""} `}>${ setDecimalDots(`${product.price * quantity}`)}</span>      
                    
                </div>
                <span className={`${styles.discount_tag} ${ !product.discountPercentage ? "hidden":""}`} >-{product.discountPercentage}%</span>
               
            </div>
        </div>
        <div className={`${styles.buy_section}`}>

            <div className={`${styles.quantity_container}`}>
                <span className={`${styles.quantity_label}`} >Cantidad: </span>
                <button className={`${styles.quantity_button}`} onClick={()=>setQuantity(Math.max(quantity - 1,1))} >{"−"}</button>
                <span className={`${styles.quantity_box}`} >{quantity}</span>
                <button className={`${styles.quantity_button}`} onClick={()=>setQuantity(quantity + 1)} >{"+"}</button>
            </div>
            <button disabled={currentVariantStock>0} className={`${styles.buy_button} ${currentVariantStock===0 ? `${styles.button_disabled}`:""}`} >{`${ currentVariantStock ? "Añadir al carrito":"Sin stock"}`}</button>
        </div>
    </div>
    )
}