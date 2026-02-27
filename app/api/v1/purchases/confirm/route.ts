import { discountProductStock } from "@/lib/server/firebase/firestoreHandler";
import { Cart,CartItem, CartSimplifiedItem,SimplifiedCart } from "@/models/cart";
import { CustomerData,Address,PersonalData } from "@/models/customer";


export async function POST(request: Request) {
    const { simplifiedCart: SimplifiedCart, customerData: CustomerData }: { simplifiedCart: SimplifiedCart, customerData: CustomerData } = await request.json();

    console.log('SimplifiedCart:', typeof SimplifiedCart.items);


    try {
        for (let i = 0; i < SimplifiedCart.items.length; i++) {
            const item = SimplifiedCart.items[i];
            await discountProductStock(item.id, item.variantName, item.quantity);
        }
        return new Response('Purchase confirmed', { status: 200 });
    } catch (error) {
        console.error('Error confirming purchase:', error);
        return new Response('Error confirming purchase', { status: 500 });
    }
}