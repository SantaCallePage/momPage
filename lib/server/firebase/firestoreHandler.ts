import "server-only";
import firestore from './firestoreInitializer';
import { Product,Variant } from "@/models/product";
import { Cart, CartItem } from "@/models/cart";
import { CustomerData } from "@/models/customer";

function mapFirestoreProduct(prodId:string, data?:FirebaseFirestore.DocumentData): Product{
  
  if(!data){
      throw new Error('No data found');
  }
  
  const rawProduct = data;

        const variants: Variant[] = rawProduct.variants.map((variant: any) => ({
              name: variant.name,
              stock: variant.stock,
              imagesUrls: variant.images_urls
          }));
  
          const prod: Product = {
              id: prodId,
              name: rawProduct.name,
              description: rawProduct.description,
              price: rawProduct.price,
              category: rawProduct.category,
              discountPercentage: rawProduct.discount,
              variants: variants
          };

      return prod;
}


export async function getProductsById(idList: string[]): Promise<Product[]> {
  if (idList.length === 0) return [];

  // Definimos el tamaño del "chunk" (límite de Firestore)
  const chunkSize = 30;
  const chunks = [];

  // Troceamos el array original (como cortar un salame)
  for (let i = 0; i < idList.length; i += chunkSize) {
    chunks.push(idList.slice(i, i + chunkSize));
  }

  // Ejecutamos todas las peticiones en paralelo para que sea rápido
  const snapshots = await Promise.all(
    chunks.map(chunk => 
      firestore.collection('products').where('__name__', 'in', chunk).get()
    )
  );

  // Aplanamos todos los resultados en una sola lista de productos
  return snapshots.flatMap(snap => 
    snap.docs.map(doc => mapFirestoreProduct(doc.id, doc.data()))
  );
}

export async function getAllProducts(): Promise<Product[]> {
  const snapshot = await firestore.collection('products').get();
  return Promise.resolve( snapshot.docs.map(doc => (
    mapFirestoreProduct(doc.id, doc.data())
  )));
}

export async function getProductById(productId: string): Promise<Product> {
  const doc = await firestore.collection('products').doc(productId).get();
  if (!doc.exists) {
    throw new Error('Product not found');
  }
  return Promise.resolve(mapFirestoreProduct(doc.id, doc.data()));
}

export async function getCategories() {
  const snapshot = await firestore.collection('categories').doc('categories').get();
  if (!snapshot.exists) {
    throw new Error('Categories not found');
  }
  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

export async function discountProductStock(productId: string, variantName: string, quantity: number): Promise<Boolean> {
  const productRef = firestore.collection('products').doc(productId);
  const productDoc = await productRef.get();

  if (!productDoc.exists) {
    throw new Error('Product not found');
  }

  const productData = productDoc.data();
  if (!productData) {
    throw new Error('Product data is undefined');
  }

  const variants = productData.variants;
  const variantIndex = variants.findIndex((v: any) => v.name === variantName);

  if (variantIndex === -1) {
    throw new Error('Variant not found');
  }

  if (variants[variantIndex].stock < quantity) {
    throw new Error('Insufficient stock');
  }

  variants[variantIndex].stock -= quantity;

  await productRef.update({ variants });
  return true;
}


export async function uploadPurchase(cart:Cart, customerData:CustomerData, shipping:number){
    const formattedPurchase = {
      "address":{
        "locality":customerData.address.locality,
        "number":customerData.address.number,
        "province":customerData.address.province,
        "street":customerData.address.street,
        "zip_code":customerData.address.zipCode,
        ...(customerData.address.apt && {"apt":customerData.address.apt}),
        ...(customerData.address.floor && {"floor":customerData.address.floor}),
        ...(customerData.address.additional && {"aditional":customerData.address.additional})
      },
      "customer_name":customerData.personalData.name,
      "contact_number":customerData.personalData.contactNumber,
      "contact_mail":customerData.personalData.contactMail,
      "total_product_shipping":shipping, // Anda a saber cómo mierda obtengo esto (El valor en general, no el parámetro xd)
      "total_purchase":cart.finalPrice,
      "items":cart.items.map((cartItem:CartItem)=>({
        "product_id":cartItem.id,
        "price":cartItem.price,
        "discount":cartItem.discountPercentage,
        "total":cartItem.totalPrice,
        "quantity":cartItem.quantity,
        "product":cartItem.productName,
        "variant":cartItem.variantName
      }))
    };

    const docRef = await firestore.collection("purchases").add(formattedPurchase);
}



/*
    En algún momento haré las funciones de userManagement
 */