"use client"
import {useState, createContext, useContext, ReactNode} from "react"
import LocalStorageManager from "@/lib/client/cart/localStorageHandler";
import { SimplifiedCart } from "@/models/cart";

type CartContextType = {
    simpliedCart: SimplifiedCart;
    addItem: (id: string, variant: string, qty: number) => void;
    removeItem: (id: string, variant: string) => void;
    reset: () => void;
};

type props = {
    children:ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }:props){
    
    const [simpliedCart,setSimpliedCart] = useState(
        LocalStorageManager.getStoredCart()
    );

    const addItem = (id:string, variant:string, qty:number) => {
        console.log("AddItem llamado desde el context");
        const newCart = LocalStorageManager.addItem(id, variant, qty);
        setSimpliedCart(newCart); 
        console.log("Item añadido hook")
    };

    const removeItem = (id:string, variant:string) => {
        const newCart = LocalStorageManager.removeItem(id, variant);
        setSimpliedCart(newCart); 
    };

    const reset = () => {
        const newCart = LocalStorageManager.resetStoredCart();
        setSimpliedCart(newCart);
    };

    return(
        <CartContext.Provider value={{simpliedCart,addItem,removeItem,reset}}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    
    // Un pequeño chequeo de seguridad de Ingeniería:
    if (context === undefined) {
        throw new Error("useCart debe ser usado dentro de un CartProvider");
    }
    
    return context;
}