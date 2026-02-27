import { getBaseUrl } from "../url/urlHandler";
import { Cart,CartItem,SimplifiedCart,CartSimplifiedItem,ErrorCart } from "@/models/cart";
import { Product } from "@/models/product";

export async function validateCart(simplifiedCart: SimplifiedCart): Promise<Cart | ErrorCart> {

    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/v1/cart/validate`,
        {   method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(simplifiedCart),
             next: { revalidate: 300 } }
    );

    if(response.ok){
        const cart:Cart = await response.json();

        return cart;
    }

    if(response.status === 406){
        const errorResponse = await response.json();
        console.log("Hay error")
        console.table(errorResponse.details)
        return errorResponse.details;
    }
    
    
    
    throw Error("Error interno del servidor");
    
}   