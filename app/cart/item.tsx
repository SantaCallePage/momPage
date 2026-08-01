"use client"
import { CartItem } from "@/models/cart";
import { useCart } from "../contexts/cartContext";
import styles from "./cart.module.css"
import Image from "next/image";
import imageRem1 from "./../pruebas/remImage1.jpg"
import { Trash2 } from "lucide-react";

import * as motion from "motion/react-client"
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/client/productsManagment/productsHandler";
import { Product } from "@/models/product";
import { capitalizeAllSentence } from "@/lib/client/generalServices/generalServices";

interface cartItemViewProps {
    item: CartItem;
    isError:boolean
}

export default function CartItemView({item, isError}: cartItemViewProps) {

    const { removeItem } = useCart();

    const [imageSrc, setImageSrc] = useState<string>("");

    const deleteHandler = () => {
        removeItem(item.id, item.variantName)
    }

    useEffect(() => {
        async function getProduct() {
            const product: Product = await getProductById(item.id);
            const variant = product.variants.find((v) =>  v.name == item.variantName );
            setImageSrc(variant?.imagesUrls[0]!);
        }

        getProduct();
    
    }, []);

    return (
        <motion.div
            className={`${styles.item_main_container} ${isError ? styles.item_error : ""}`}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <div>
                {imageSrc ?
                    <Image
                        className={`${styles.image}`}
                        src={imageSrc}
                        alt="Rem image"
                        width={100}
                        height={100}
                       
                    />
                    : ""}
            </div>
            <div className={`${styles.data_section}`}>
                <div className={`${styles.top_section}`}>
                    <span className={`${styles.item_name}`} > {`${item.productName} - ${item.variantName}`}</span>
                    <button className={`${styles.item_delete_button}`} onClick={deleteHandler} > <Trash2 /> </button>
                </div>

                <div className={`${styles.bottom_section}`}>
                    <span className={`${styles.item_quantity}`}> {item.quantity}u</span>
                    <span className={`${styles.item_total_price}`}> ${item.totalPrice}</span>
                </div>
            </div>

        </motion.div>
    );
}