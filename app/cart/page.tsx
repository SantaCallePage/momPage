"use client"

import { useCart } from "../contexts/cartContext";
import { Cart, CartItem, ErrorCart, isErrorCart} from "@/models/cart";
import { validateCart } from "@/lib/client/cart/cartHandler";
import { useEffect, useState } from "react";
import CartItemView from "./item";
import styles from "./cart.module.css"

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import StockWarningModal from "./stockWarningModal";
import { useRouter } from "next/navigation";

export default function CartSection(){

    const {simpliedCart, removeItem, addItem} = useCart();
    const [cart,setCart] = useState<Cart | ErrorCart | null>(null);
    const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartValidate: Cart | ErrorCart = await validateCart(simpliedCart);
                setCart(cartValidate);
            } catch (error) {
                console.error("Error validando el carrito:", error);
            }
        };
        fetchCart();
    }, [simpliedCart]);

    useEffect(()=>{
        setPopUpOpen(isErrorCart(cart))
        if (isErrorCart(cart)){
            console.table(cart.itemsWidoutStock)
        }
    },[cart])

    const handleRemoveItem = (prodId:string, variant:string) => {
        console.log(`HancleRemove called atrs ${prodId} ${variant}`)
        removeItem(prodId, variant) 
    }

    const handleKeepItem = (prodId:string, variant:string) => {
        removeItem(prodId, variant) 
        let avilable: number = 0
        if(isErrorCart(cart)){
            avilable = cart.itemsWidoutStock.find(p => p.id == prodId && p.variantName == variant)?.available ?? 0 
        }
        if (avilable <= 0) 
            return
        addItem(prodId,variant, avilable)
    }

    const onPopUpClose = () =>{
        setPopUpOpen(false)
    }

    const handleBuybutton = () => {
        setPopUpOpen(isErrorCart(cart))
        if(!isErrorCart(cart)){
            router.push("/buy")
        }
    }

    //Sé que no es eficiente
    const isInErrorCart = (prodId:string, variantName:string):boolean =>{
        if(!isErrorCart(cart))
            return false;
        return cart.itemsWidoutStock.find(p=> p.id === prodId && p.variantName === variantName) != undefined
    }

    return(
        <main className={styles.main_container}>
           
            { isErrorCart(cart) ? <StockWarningModal isOpen={popUpOpen} items={cart.itemsWidoutStock} onKeepAvailable={handleKeepItem} remove={handleRemoveItem} onClose={onPopUpClose} /> : ""}
    <div>
        <AnimatePresence>
            {(cart != null && cart.items.length > 0) ? 
            <div>

                {cart.items.map((item) => <CartItemView key={item.id + item.variantName} item={item} isError={isInErrorCart(item.id, item.variantName)} />) }

                
               
            </div>
                : <span className={styles.empty_cart_msg}>No hay productos para mostrar</span>
            }
        </AnimatePresence>
    </div>

              

    {cart != null && cart.items.length > 0 && (
        <div className={styles.summary_container}>
            <div className={styles.summary_row}>
                <span>Total productos:</span>
                <span>${cart.totalPrice}</span>
            </div>
            

            {cart.totalPrice > cart.finalPrice && (
                <div className={styles.summary_row}>
                    <span>Descuento:</span>
                    <span className={styles.discount_text}>-${cart.totalPrice - cart.finalPrice}</span>
                </div>
            )}

            <div className={styles.total_row}>
                <span>Total a pagar:</span>
                <span>${cart.finalPrice}</span>
            </div>

            <button onClick={()=>router.push("/products")} className={`${styles.buy_button} ${styles.continue_buiying_button}`}>
                Seguir eligiendo productos
            </button>

            <button onClick={()=>handleBuybutton()} className={styles.buy_button}>
                Iniciar Compra
            </button>
        </div>
    )}
</main>
    );
}