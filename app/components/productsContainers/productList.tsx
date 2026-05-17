import { Product } from "@/models/product";
import ProductPreview from "../productPreview/productPreview";
import Link from "next/link";
import styles from "./productList.module.css"
import { capitalizeAllSentence } from "@/lib/client/generalServices/generalServices";
interface ListGridProps {
    name: string;
    products: Product[];
    type: string; //Que se está mostrando such as category, subcategory
}

export default async function ProductsListGrid(props: ListGridProps) {

    const products = props.products;
    const name = props.name;
    const type = props.type;
    return (
        <div className={styles.subcategory_section}>
            <h2>{capitalizeAllSentence(name)}</h2>

            <div className={styles.products_container}>
                {products.map((product) => (
                    <ProductPreview key={`${product.id}`} product={product} />
                ))}
            </div>

            <div style={{ textAlign: 'center' }}> {/* Centramos el Ver más */}
                <Link
                    href={`/${type}/${name.replaceAll(" ", "_")}`}
                    className={styles.view_more_link}
                >
                    Ver toda la categoría de {name.toLowerCase()}
                </Link>
            </div>
        </div>
    );
}