import { Key } from "react";
import { Product,Variant } from "@/models/product";
import { getAllProducts } from "@/lib/client/productsManagment/productsHandler";
import { Cart, CartItem,CartSimplifiedItem, SimplifiedCart,ErrorCart } from "@/models/cart";
import { validateCart } from "@/lib/client/cart/cartHandler";
import { getBaseUrl } from "@/lib/client/url/urlHandler";
import TemporalButton from "./temporalButton";
//const querySnapshot2 = await fetch('/api/v1/getData?filterName=Nombre&filterValue=Luca');

export const revalidate = 600;

export default async function Home() {
  const data: Product[] = await getAllProducts();
  
  const simplifiedCart: SimplifiedCart = {
    items: data.map((product) => ({
      id: product.id,
      variantName: product.variants[0]?.name || '',
      //quantity: product.variants[0].stock * 100
      quantity: 1
    })),
    updatedAt: new Date().toISOString()
  };

  const cart = await validateCart(simplifiedCart);
  const isError = 'itemsWidoutStock' in cart;
  return (
    <main>
      <h1>Welcome to my app!</h1>
      <div>
      <strong> Es array: { Array.isArray(simplifiedCart.items) ? "SI" : "NO"}</strong>
        {cart.items? cart.items.map((item: CartItem, index: Key) => (
          <div key={index}>
            Product ID: {item.id}, Variant Name: {item.variantName}, Quantity: {item.quantity}, Price: {item.price}, Total Price: {item.totalPrice}, Discount Percentage: {item.discountPercentage}%
          </div>
        )):'HOLA'}

        <div>
          Hay Productos pedidos sin Stock? 
          {isError? "SI":"NO"}
        </div>

        <div>
          Cart Total Price: {cart.totalPrice}, Cart Final Price: {cart.finalPrice}
        </div>
      </div>

      <div>
        {data.map((elem: Product) => (
          <div key={elem.id}>
            nombre: <strong>{elem.name}</strong>, descripcion: {elem.description}, precio: {elem.price}, categoria: {elem.category}, descuento: {elem.discountPercentage}%
            <br />
            id: {elem.id}
            <br />
            Variantes:
            {elem.variants.map((variant) => (
              <div key={variant.name}>
                {variant.name}, stock: {variant.stock}
                <br />
                <img
                  src={variant.imagesUrls[0] ? variant.imagesUrls[0] : '#'}
                  style={variant.imagesUrls[0] ? { width: '400px' } : {}}
                  alt=""
                />
                <button style={{ backgroundColor: '#00ff00', color: '#ffffff' }}>Agregar al carrito</button>
              </div>
            ))}
            
          </div>
        ))}
      </div>
      <TemporalButton cart={simplifiedCart} />
    </main>
  );
}
