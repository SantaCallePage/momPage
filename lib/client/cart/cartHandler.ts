
import { Cart,SimplifiedCart,ErrorCart } from "@/models/cart";
import { CustomerData } from "@/models/customer";

export async function validateCart(simplifiedCart: SimplifiedCart): Promise<Cart | ErrorCart> {

    const response = await fetch(`/api/v1/cart/validate`,
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

export async function confirmPurchase(simplifiedCart:SimplifiedCart, customerData:CustomerData){
    const param = {simplifiedCart:simplifiedCart, customerData:customerData};

    const response = await fetch(`/api/v1/purchases/confirm`,
        {   method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)}
    );
    console.log("Confirmación pedida");

        if(response.ok){
             return await response.json();
        }

    if(response.status === 406){
        const errorResponse = await response.json();
        console.log("Hay error")
        console.table(errorResponse.details)
        return errorResponse.details;
    }
}