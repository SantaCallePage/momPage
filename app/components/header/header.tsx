import styles from "./header.module.css"
import CategoriesSection from "./categoriesLinks/categoriesSection"
import Link from "next/link"
import CartIcon from "./cart/cartIcon"
export default function Header(){


    return (
        <header className={`${styles.main_container}`}>
            <div className={`${styles.top_section}`} >
                <Link href={"/"} >LOGO</Link>
                <CartIcon/>
            </div>
            <div className={`${styles.bottom_section}`}>
                <CategoriesSection/>
            </div>
            
        </header>
    )
}