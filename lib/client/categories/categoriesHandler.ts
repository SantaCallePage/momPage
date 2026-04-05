import { getBaseUrl } from "../url/urlHandler";

export async function getAllCategories(): Promise<any> {//Todavía no definí modelo de datos para esto {

    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/categories`,
        { next: { revalidate: 300 } }
    );
    const categories = await response.json();
    
    return categories.categories;
}