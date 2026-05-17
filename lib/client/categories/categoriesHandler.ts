export async function getAllCategories(): Promise<any> {//Todavía no definí modelo de datos para esto {

    const response = await fetch(`/api/v1/categories`,
        { next: { revalidate: 300 } }
    );
    const categories = await response.json();
    
    return categories.categories;
}