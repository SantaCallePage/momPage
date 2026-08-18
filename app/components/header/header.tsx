import styles from "./header.module.css"
import CategoriesSection from "./categoriesLinks/categoriesSection"
import Link from "next/link"
import CartIcon from "./cart/cartIcon"
import Image from "next/image"
import logo from "@/assets/santaCalleIcon.webp"

export default function Header(){


    return (
        <header className={`${styles.main_container}`}>
            <div className={`${styles.top_section}`} >
                <Link className={`${styles.main_image_container}`} href={"/"} > 
                <Image
                    className={`${styles.main_image}`}
                    src={logo}
                    alt="Logo"
                    width={135}
                    unoptimized={true}
                /> </Link>
                <CategoriesSection/>
                <CartIcon/>
            </div>
            <div className={`${styles.bottom_section}`}>
               
            </div>
            
        </header>
    )
}