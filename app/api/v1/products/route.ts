import { getAllProducts, getProductById } from "@/lib/server/firebase/firestoreHandler";
import { NextResponse } from "next/server";


export async function GET(request: Request) {

    try {
        let snapshot = null;

        const url = new URL(request.url);
        const productId = url.searchParams.get("productId");

        if (productId) {
            snapshot = await getProductById(productId);
        }
        else {
            snapshot = await getAllProducts();
        }
        return NextResponse.json(snapshot, {status: 200});
    } catch (errorSearatching: any) {
        if(errorSearatching.message === "Product not found"){
            return NextResponse.json({error: 'Product not found'}, {status: 404})
        }
        return NextResponse.json({error:'Internal server Error'},{status: 500})
    }




}

