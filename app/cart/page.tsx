"use client"

import { useCart } from "../contexts/cartContext";
import { Cart, CartItem, ErrorCart } from "@/models/cart";
import { validateCart } from "@/lib/client/cart/cartHandler";
import { useEffect, useState } from "react";
import CartItemView from "./item";
import styles from "./cart.module.css"

import { AnimatePresence } from "motion/react";
import Link from "next/link";

export default function CartSection(){

    const {simpliedCart} = useCart();
    const [cart,setCart] = useState<Cart | ErrorCart | null>(null);

    useEffect(() => {
        // 1. Declaramos la función interna
        const fetchCart = async () => {
            try {
                const cartValidate: Cart | ErrorCart = await validateCart(simpliedCart);
                setCart(cartValidate);
            } catch (error) {
                console.error("Error validando el carrito:", error);
            }
        };

        // 2. La ejecutamos
        fetchCart();
    }, [simpliedCart]);

    return(
        <main>
            <div className={`${styles.main_container}`}>
                <AnimatePresence>
                    {(cart != null && cart.items.length > 0) ? 
                    
                    cart.items.map((item:CartItem)=>{return <CartItemView key={item.id + item.variantName} item={item} />}) 
                    
                    : <span>No hay productos para mostrar</span>}
            
                </AnimatePresence>
                </div>

                <div>
                    { cart != null && cart.items.length>0 ? <div>
                        Total productos:{cart?.totalPrice} 
                        Descuento {cart.totalPrice - cart.finalPrice}
                        Total a pagar:{cart?.finalPrice}
                        <Link href={"/buy"}>Continuar compra</Link>
                    </div>  :""}
                   
                </div>
        </main>
    );
}