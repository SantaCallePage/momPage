
import { Cart,SimplifiedCart,ErrorCart } from "@/models/cart";
import { CustomerData } from "@/models/customer";

export interface ResponseConfirm{
    message:string,
    error:boolean,
    details?:{}
}

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

export async function confirmPurchase(simplifiedCart:SimplifiedCart, customerData:CustomerData):Promise<ResponseConfirm>{
    const param = {simplifiedCart:simplifiedCart, customerData:customerData};

    const toRet = {message:"",error:true,details:{}}

    const response = await fetch(`/api/v1/purchases/confirm`,
        {   method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)}
    );
    console.log("Confirmación pedida");

    const responseBody = await response.json();

    toRet.message = responseBody.message
    toRet.error = (response.status !== 201);
    toRet.details = responseBody.details;


    return toRet;
}