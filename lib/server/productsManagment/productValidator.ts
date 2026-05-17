import "server-only";
import { Product } from "@/models/product";
import { Cart, CartItem, CartSimplifiedItem, ErrorCart, SimplifiedCart } from "@/models/cart"; // Usaremos este para el input
import { getProductsById } from "../firebase/firestoreHandler";
import { ProductNotFoundError } from "../errors";

interface ValidatedProducts {
    isStockAvailable: boolean;
    details: { id: string; variant: string; requested: number; available: number }[];
    products:Product[]
}

export async function validateProductsStock(cartItems: CartSimplifiedItem[]): Promise<ValidatedProducts> {
    

    // 1. Obtenemos los IDs únicos del carrito para pedir a Firestore
    const productsIds = Array.from(new Set(cartItems.map(item => item.id)));
    
    // 2. Pedimos la data real de la DB (la verdad absoluta del stock)
    const dbProducts = await getProductsById(productsIds);

    const toRet: ValidatedProducts = { isStockAvailable: true, details: [], products:dbProducts };


    //convertimos en Map para acceso O(1) a cada producto por su ID (en vez de O(n) con find)
    const productsMap = new Map(dbProducts.map(p => [p.id, p]));
    
    // 3. Iteramos sobre lo que el cliente QUIERE comprar
    for (const item of cartItems) {
        // Buscamos el producto correspondiente en la data de la DB
        const dbProduct = productsMap.get(item.id);
        
        if (!dbProduct) {
            throw new ProductNotFoundError(item.id);
        }

        // Buscamos la variante específica (ej: "Rojo - L")
        const dbVariant = dbProduct.variants.find(v => v.name === item.variantName);
        const availableStock = dbVariant ? dbVariant.stock : 0;

        // 4. La validación real
        if (!dbVariant || availableStock < item.quantity) {
            toRet.isStockAvailable = false;
            toRet.details.push({
                id: item.id,
                variant: item.variantName,
                requested: item.quantity,
                available: availableStock
            });
        }
    }

    return toRet;
}

export async function validateCart(simplifiedCart:SimplifiedCart):Promise<Cart | ErrorCart>{

    const { isStockAvailable, details, products } = await validateProductsStock(simplifiedCart.items);
    
        const itemsDetailed: CartItem[] = simplifiedCart.items.map((item: CartSimplifiedItem) => {      
            const product= products.find((p) => p.id === item.id)
            const availabe = (details.find((i) => i.id === item.id && i.variant === item.variantName) === undefined)
            return {
                id: item.id,
                productName: product?.name || "", 
                variantName: item.variantName,
                quantity: item.quantity,
                price: availabe ? (product?.price || 0) : 0,
                totalPrice: availabe&&product ? ((product?.price * (1 - product?.discountPercentage/100)|| 0) * item.quantity) : 0,
                discountPercentage: availabe ? (product?.discountPercentage || 0) : 0
            };
        });
    
        //const itemsDetailed = await Promise.all(itemsDetailedPromises);
    
        const cart = {
            items: itemsDetailed,
            totalPrice: itemsDetailed.reduce((acc, item) =>  acc + item.price, 0),
            finalPrice: itemsDetailed.reduce((acc, item) => acc + item.price * (1 - item.discountPercentage / 100), 0),
        }
    
        if (!isStockAvailable) {
            const errorCart = {...cart,itemsWidoutStock:details}
            return errorCart;
        }
    
        return cart

}