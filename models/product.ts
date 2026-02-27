export interface Variant{
    name: string;
    stock: number;
    imagesUrls: string[];
}    

export interface Product{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    discountPercentage: number;
    variants: Variant[];
}