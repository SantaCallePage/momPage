import { getCategories } from "@/lib/server/firebase/firestoreHandler";
import { NextResponse } from "next/server";

export async function GET(request: Request):Promise<Response>{

    const toRet = await getCategories();
    console.log("FROM API")
    console.table(toRet);

    return NextResponse.json(toRet ,{status: 200});
}