import { discountProductsStock,uploadPurchase } from "@/lib/server/firebase/firestoreHandler";
import { validateCart } from "@/lib/server/productsManagment/productValidator";
import { NextResponse } from "next/server";
import { getShipping } from "@/lib/server/shipping.ts/correoArgentinoAPIClient";
import { ProductNotFoundError } from "@/lib/server/errors";
import { PersonalData } from "@/models/shipping";

export async function POST(request: Request):Promise<NextResponse> {
    const { simplifiedCart, personalData, shippingData } = await request.json();

    console.log('SimplifiedCart',simplifiedCart)

   // console.log('SimplifiedCart:', typeof SimplifiedCart.items);


    try {
        const cart = await validateCart(simplifiedCart);
        
       // console.log("cart",cart);

        console.log("CustomerData",personalData);

        if('itemsWidoutStock' in cart){
            return NextResponse.json({ error: 'Insufficient stock for one or some products', details: cart }, { status: 406 });
        }
        await discountProductsStock(cart.items);
        
        //Hagamos de cuenta que acá obtengo el envío
        const shipping:number = await getShipping(); //Esto devuelve 0
        
        // For Debugging reazons Ill disabled this 
        await uploadPurchase(cart,personalData, shippingData ,shipping);

        return NextResponse.json({message:'Purchase confirmed'}, { status: 201 });

    } catch (error) {

        if (error instanceof ProductNotFoundError){
            return NextResponse.json({error: 'Product not Found', details: `${error}`}, { status: 404 });
        }

        console.error('Error confirming purchase:', error);
        return NextResponse.json({error: 'Error confirming purchase', details: `${error}`}, { status: 500 });
    }
}