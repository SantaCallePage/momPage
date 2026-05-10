import Link from "next/link";

export default function CartIcon(){
    return(
        <Link href={"/cart"}>Carrito</Link>
    );
}