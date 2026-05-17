"use client"
import { useCart } from "@/app/contexts/cartContext";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import styles from "./../header.module.css"

export default function CartIcon(){
    const {simpliedCart} = useCart();
    return(
        <div className={styles.cart_section}>
            <span className={`${ simpliedCart && simpliedCart.items.length ? styles.intems_quantity : "hidden"}`} >{simpliedCart && simpliedCart.items.length ? simpliedCart.items.length:""}</span>
            <Link href={"/cart"}> <ShoppingCartIcon color="black" size={30} /> </Link>
        </div>
        
    );
}