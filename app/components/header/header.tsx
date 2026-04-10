import styles from "./header.module.css"
import CategoriesSection from "./categoriesSection"
import Link from "next/link"
export default function Header(){


    return (
        <header>
            <div> <Link href={"/"} >LOGO</Link></div>
            <CategoriesSection/>
        </header>
    )
}