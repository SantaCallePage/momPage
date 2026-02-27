import { SimplifiedCart} from "@/models/cart";
import { NextResponse} from "next/server";
import { validateCart } from "@/lib/server/productsManagment/productValidator";



export async function POST(request: Request):Promise<Response> {

    const reqBody: SimplifiedCart = await request.json();

    const cart = await validateCart(reqBody);

    const isStockAvailable = !('itemsWidoutStock' in cart);

    if (!isStockAvailable) {
        return NextResponse.json({ error: 'Insufficient stock for one or some products', details: cart }, { status: 406 });
    }

    return NextResponse.json(cart, { status: 200 });
}