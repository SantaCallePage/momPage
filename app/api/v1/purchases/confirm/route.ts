import { discountProductsStock,uploadPurchase } from "@/lib/server/firebase/firestoreHandler";
import { Cart,CartItem, CartSimplifiedItem,SimplifiedCart } from "@/models/cart";
import { CustomerData,Address,PersonalData } from "@/models/customer";
import { validateCart } from "@/lib/server/productsManagment/productValidator";
import { NextResponse } from "next/server";
import { getShipping } from "@/lib/server/shipping.ts/correoArgentinoAPIClient";

export async function POST(request: Request):Promise<Response> {
    const { simplifiedCart: SimplifiedCart, customerData: CustomerData } = await request.json();

    console.log('SimplifiedCart',SimplifiedCart)

   // console.log('SimplifiedCart:', typeof SimplifiedCart.items);


    try {
        const cart = await validateCart(SimplifiedCart);
        
       // console.log("cart",cart);

        console.log("CustomerData",CustomerData);

        if('itemsWidoutStock' in cart){
            return NextResponse.json({ error: 'Insufficient stock for one or some products', details: cart }, { status: 406 });
        }
        await discountProductsStock(cart.items);
        
        //Hagamos de cuenta que acá obtengo el envío
        const shipping:number = await getShipping(); //Esto devuelve 0
        
        await uploadPurchase(cart,CustomerData,shipping);

        return new Response('Purchase confirmed', { status: 200 });

    } catch (error) {
        console.error('Error confirming purchase:', error);
        return new Response('Error confirming purchase', { status: 500 });
    }
}