import { useCart } from "@/app/contexts/cartContext";
import styles from "./productView.module.css"
import { useState } from "react";

import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react";


interface BuyButtonProps{
    currentVariantStock:number;
    id:string;
    currentVariant:string;
    quantity:number;
}

export default function BuyButton({currentVariantStock, id, currentVariant, quantity}:BuyButtonProps){

    const [currentText, setCurrentText] = useState<number>(0);
    const text = ["Añadir al carrito", "Añadiendo...", "Añadido"];
    const {addItem} = useCart();
    function handleAddToCart(){
        addItem(id,currentVariant,quantity);
        setCurrentText(1);
        const timer = setTimeout(() => {setCurrentText(2)}, 1750);

        const timer2 = setTimeout(() => {setCurrentText(0)}, 3000);
    }

   

    return(
        <motion.button 
        disabled={currentVariantStock<1 || currentText>0} 
        className={`${styles.buy_button} ${currentVariantStock===0 ? `${styles.button_disabled}`:""}`}
        onClick={handleAddToCart}
        whileTap={{scale:0.9,background:"#141414"}}
        whileHover={{scale:1.1}}
        whileFocus={{outline:0, border:0}}
        >
            
            <AnimatePresence mode="wait">
                <motion.span
                    key={text[currentText]}
                    className={`${styles.buy_text}`}
                    initial={{y:20,opacity:0}}
                    animate={{y:0, opacity:1}}
                    exit={{y:-20,opacity:0}}
                    transition={{
                        duration: 0.4
                    }}
                >
                    {`${ currentVariantStock ? text[currentText]:"Sin stock"}`}
                </motion.span>
                { currentText==2 ? 
                <motion.span
                className={`${styles.buy_text_check}`}
                initial={{x:20, opacity:0, rotate:-90}}
                animate={{x:0,y:0,opacity:1, rotate: 0}}
                exit={{y:-20, opacity:0}}
                transition={{duration:0.4}}
                > ✓</motion.span>
                :""}
            </AnimatePresence> 
        </motion.button>
    );
}