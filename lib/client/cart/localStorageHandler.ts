"use client"
import { CartSimplifiedItem, SimplifiedCart } from "@/models/cart";

class LocalStorageManager{
    private static itemName:string = "MarquessaRebelCart";

    private static emptyCart:SimplifiedCart = {
            items: [],
            updatedAt:'0',

        };


    private static initCart(){
        localStorage.setItem(this.itemName,JSON.stringify(this.emptyCart));
    }    

    public static getStoredCart():SimplifiedCart{

        if (typeof window === "undefined") {
            return this.emptyCart; // Devolvemos el carrito vacío si es el server
        }

        let toRet:SimplifiedCart = structuredClone(this.emptyCart);

        const item:string | null = localStorage.getItem(this.itemName);

        if (item != null){
            try{
                toRet = JSON.parse(item) as SimplifiedCart;
            } catch(e){
                console.log(`Hubo un error al tratar de leer y parcear el carrito, ${e}`);
                this.initCart();
              //  throw new Error("Error en LocalStorageManager.getStoredCart");
            }
        } else{
            this.initCart();
        }

        return toRet;
    }

    public static addItem(id:string,variant:string,quantity:number):SimplifiedCart{

        if (typeof window === "undefined") {
            return this.emptyCart; // Devolvemos el carrito vacío si es el server
        }

        if(id === "" || variant === "" || quantity<1){
            throw new Error("Invalid args in LocalStorageManager.addItem");
        }

        const item:CartSimplifiedItem = {
            id:id,
            variantName:variant,
            quantity:quantity,
        }
        
        const storedCart:SimplifiedCart = this.getStoredCart();

        const existing = storedCart.items.find(
            i => i.id === id && i.variantName === variant
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            storedCart.items.push(item);
        }

        localStorage.setItem(this.itemName,JSON.stringify(storedCart));
        console.log("Item añadido");
        return storedCart;
    }

    public static removeItem(id:string, variant:string):SimplifiedCart{
        

        if (typeof window === "undefined") {
            return this.emptyCart; // Devolvemos el carrito vacío si es el server
        }
        
        const storedCart:SimplifiedCart = this.getStoredCart();
        
        storedCart.items = storedCart.items.filter(item => !(item.id === id && item.variantName === variant));
        
        localStorage.setItem(this.itemName,JSON.stringify(storedCart));

        return storedCart;
    }

    public static resetStoredCart(): SimplifiedCart{
        this.initCart();
        return structuredClone(this.emptyCart);
    }
}
export default LocalStorageManager;