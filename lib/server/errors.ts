export class ProductNotFoundError extends Error{
    constructor(id:string){
        super(`Producto ${id} no existe en la base de datos`);

        this.name = "ProductNotFoundError"
    }
}