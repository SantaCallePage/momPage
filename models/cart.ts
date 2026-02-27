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
    requestedQuantity:number;
    availableStock:number;
}

export interface ErrorCart extends Cart{
    itemsWidoutStock:ErrorItem[];
}