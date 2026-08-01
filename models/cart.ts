export interface CartSimplifiedItem {
  id: string;
  variantName: string;
  quantity: number;
}

export interface SimplifiedCart{
    updatedAt: string;
    items: CartSimplifiedItem[];
}

export interface CartItem{
    id: string;
    variantName: string;
    quantity: number;
    price: number;
    totalPrice: number;
    discountPercentage: number;
    productName:string
}

export interface Cart{
    items: CartItem[];
    totalPrice: number;
    finalPrice: number;
}



export interface ErrorItem{
    id:string;
    name:string;
    variantName:string;
    requestedQuantity:number;
    available:number;
}

export interface ErrorCart extends Cart{
    itemsWidoutStock:ErrorItem[];
}

export function isErrorCart(cart : Cart | ErrorCart | null) : cart is ErrorCart{
    return cart !== null && "itemsWidoutStock" in cart
}