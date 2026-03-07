import { NextResponse } from "next/server";
import { getShipping } from "@/lib/server/shipping.ts/correoArgentinoAPIClient";

export async function GET(request: Request) {

    const shipping = getShipping();
   return NextResponse.json(shipping,{"status":200});

}