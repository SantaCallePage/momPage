   import { Product, Variant } from "@/models/product";
   
   export function sortProduct(product: Product): Product {
        product.variants = sortVariants(product.variants);
        return product;
    }

    function sortVariants(variants: Variant[]): Variant[] {

        if (variants.length <= 1) {
            return variants;
        }

        // Elegimos un pivote (en este caso, el último elemento)
        const pivot: Variant = variants[variants.length - 1];
        const left: Variant[] = [];
        const right: Variant[] = [];

        for (let i = 0; i < variants.length - 1; i++) {
            if (variants[i].stock > pivot.stock) {
                left.push(variants[i]);
            } else {
                right.push(variants[i]);
            }
        }


        return [...sortVariants(left), pivot, ...sortVariants(right)];
    }

    export function setDecimalDots(price: string) {
        let reverse: string = price.split("").reverse().join("");
        let conPuntos = "";

        for (let i = 0; i < reverse.length; i++) {
            if (i > 0 && i % 3 === 0) {
                conPuntos += ".";
            }
            conPuntos += reverse[i];
        }

        return conPuntos.split("").reverse().join("");
    }