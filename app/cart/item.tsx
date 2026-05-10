import { CartItem } from "@/models/cart";
import { useCart } from "../contexts/cartContext";
import styles from "./cart.module.css"
import Image from "next/image";
import imageRem1 from "./../pruebas/remImage1.jpg"


import * as motion from "motion/react-client"

interface cartItemViewProps{
    item:CartItem;
}

export default function CartItemView(props:cartItemViewProps){

    const {removeItem} = useCart();

    const item:CartItem  = props.item;

    const deleteHandler = ()=>{
        removeItem(item.id,item.variantName)
    }

    return(
        <motion.div 
        className={`${styles.item_main_container}`}
        exit={{opacity:0}}
        transition={{duration:1}}
        >
            <div>
                <Image
                    className={`${styles.image}`}
                    src={imageRem1}
                    alt="Rem image"
                    width={100}
                    height={100}
                    placeholder="blur"
                />
            </div>
            <div className={`${styles.data_section}`}>
                <div className={`${styles.top_section}`}>
                    <span className={`${styles.item_name}`} > {`${item.productName} ${item.variantName}`}</span>
                    <button className={`${styles.item_delete_button}`} onClick={deleteHandler} > icon </button> 
                </div>
                
                <div className={`${styles.bottom_section}`}>
                    <span className={`${styles.item_quantity}`}> {item.quantity}u</span> 
                    <span className={`${styles.item_total_price}`}> ${item.totalPrice}</span>   
                </div> 
            </div>
            
        </motion.div>
    );
}