import "server-only";
import firestore from './firestoreInitializer';
import firebase from "./firebaseInitializer";
import { Product,Variant } from "@/models/product";
import { Cart, CartItem, CartSimplifiedItem } from "@/models/cart";
import { CustomerData } from "@/models/customer";

function mapFirestoreProduct(prodId:string, data?:FirebaseFirestore.DocumentData): Product{
  
  if(!data){
      throw new Error('No data found');
  }
  
  const rawProduct = data;

        const rawVariants = Object.values(rawProduct.variants);
        const variants: Variant[] = rawVariants.map((variant: any) => ({
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
              discountPercentage: rawProduct.discouant,
              variants: variants
          };

      return prod;
}


export async function getProductsById(idList: string[]): Promise<Product[]> {
  if (idList.length === 0) return [];

  const chunkSize = 30;
  const chunks = [];

  for (let i = 0; i < idList.length; i += chunkSize) {
    chunks.push(idList.slice(i, i + chunkSize));
  }

  const snapshots = await Promise.all(
    chunks.map(chunk => 
      firestore.collection('products').where('__name__', 'in', chunk).get()
    )
  );


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
  const snapshot = await firestore.collection('configs').doc('categories').get();
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

export async function discountProductsStock(items: CartItem[]):Promise<Boolean>{
  try{
    const batch = firestore.batch();
    
    items.forEach(item =>{
      const ref = firestore.collection('products').doc(item.id);

      const stockField = `variants.${item.variantName}.stock`

      batch.update(ref,{
        [stockField] : firebase.firestore.FieldValue.increment(item.quantity * -1)
      })
    });

    batch.commit()
    

  return true;
  }
  catch(error){
    console.log(`Error descontando el stock de los productos ${error}`);
    throw Error(`${error}`);
    
    return false;
  }
}

async function getPurchaseCode():Promise<Number>{
  
  const confDocRef = firestore.collection("configs").doc("next_purchase_code")
  let toRet = 0;
  try {
    await firestore.runTransaction(async (transaction) => {
      // 1. LEER PRIMERO
      const confDoc = await transaction.get(confDocRef);

      // Obtenemos el stock actual (asumiendo que es un number)
      const data = confDoc.data();
      const currentCode = data?.code || 0;
      const newCode = currentCode + 1;
      toRet = currentCode;

      // 2. ESCRIBIR DESPUÉS
      transaction.update(confDocRef, { code: newCode });
    });
    return toRet;
    console.log("Transacción completada con éxito.");
  } catch (error) {
    console.error("La transacción falló: ", error);
  }
  
  
  return 0; //Para que TS no joda
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
      "date":new Date().toLocaleDateString(),
      "code": await getPurchaseCode(),
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