import {Product,Variant} from '@/models/product';
import { getBaseUrl } from '@/lib/client/url/urlHandler';
import next from 'next';

export async function getAllProducts(): Promise<Product[]> {

    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/products`,
        { next: { revalidate: 300 } }
    );
    const products = await response.json();
    
    return products;
}

export async function getProductById(productId: string): Promise<Product> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/products/${productId}`,
        { next: { revalidate: 300 } }
    );
    const product = await response.json();

    return product;
}