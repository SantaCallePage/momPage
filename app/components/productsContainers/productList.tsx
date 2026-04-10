import { Product } from "@/models/product";
import ProductPreview from "../productPreview/productPreview";
import Link from "next/link";
import styles from "./productList.module.css"
interface ListGridProps{
    name:string;
    products:Product[];
    type:string; //Que se está mostrando such as category, subcategory
}

export default async function ProductsListGrid(props:ListGridProps){

    const products = props.products;
    const name = props.name;
    const type = props.type;
    return (
        <div>
            <div>{name}</div>
            <div className={`${styles.products_container}`}>
                {products.map((product)=>{
                return <ProductPreview key={`${product.id}`} product={product} />
            })}
            </div>
            <Link href={`/?${type}=${name}`}>Ver más</Link>
        </div>
    );
}