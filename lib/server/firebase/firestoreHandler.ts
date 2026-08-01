import "server-only";
import firestore from './firestoreInitializer';
import firebase from "./firebaseInitializer";
import { Product,Variant } from "@/models/product";
import { Cart, CartItem, CartSimplifiedItem } from "@/models/cart";
import { CustomerData } from "@/models/customer";
import { Category, Subcategory } from "@/models/categories";
import { ShippingData } from "@/models/shipping";
import { PersonalData } from "@/models/shipping";

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
              subcategory: rawProduct.subcategory,
              discountPercentage: rawProduct.discount,
              variants: variants,
              featured: rawProduct.featured,
              new: rawProduct.new
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

export async function getCategories(): Promise<Category[]> {
  const snapshot = await firestore.collection('configs').doc('categories').get();
  if (!snapshot.exists) {
    throw new Error('Categories not found');
  }

  const data = snapshot.data();

  const toRet = data ? data.categories.map((category:any)=>{
    return {
      name:category.name,
      subcategories:category.subcategories
    }
  }) : [] ;

  return toRet
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

export async function uploadPurchase(
  cart: Cart,
  personalData: PersonalData,
  shippingData: ShippingData,
  shipping: number
) {
  // 1. Mapeo de items
  const items = cart.items.map((cartItem: CartItem) => ({
    product_id: cartItem.id,
    product: cartItem.productName,
    quantity: cartItem.quantity,
    price: cartItem.price,
    discount: cartItem.discountPercentage,
    total: cartItem.totalPrice,
    variant: cartItem.variantName,
  }));

  // 2. Mapeo de la estructura de envío (Maneja Domicilio o Sucursal)
  const formattedShippingData = {
    zip_code: shippingData.zipCode,
    type:shippingData.type,
    ...(shippingData.address && {
      address: {
        street: shippingData.address.street,
        number: shippingData.address.number,
        locality: shippingData.address.locality,
        province: shippingData.address.province,
        ...(shippingData.address.apt && { apt: shippingData.address.apt }),
        ...(shippingData.address.floor && { floor: shippingData.address.floor }),
        ...(shippingData.address.aditional && { aditional: shippingData.address.aditional }),
      },
    }),
    ...(shippingData.sucursalData && {
      sucursal_data: {
        sucursal_id: shippingData.sucursalData.sucursalId,
        address: shippingData.sucursalData.address,
        name: shippingData.sucursalData.name,
      },
    }),
  };

  // 3. Payload final respetando snake_case para Firestore
  const formattedPurchase = {
    code: await getPurchaseCode(),
    date: new Date().toLocaleDateString(), // Es recomendable usar ISO8601 o Timestamp de Firestore en vez de string local
    items,
    personal_data: {
      name: personalData.name,
      contact_number: personalData.contactNumber,
      contact_mail: personalData.contactMail,
    },
    shipping_data: formattedShippingData,
    total_product_shipping: shipping,
    total_purchase: cart.finalPrice,
  };

  const docRef = await firestore.collection("purchases").add(formattedPurchase);
  return docRef.id;
}

export async function getProductsBySubcategory(subcategory:string):Promise<Product[]>{
  return getProductsByProperty('subcategory',subcategory);
  
}

export async function getProductsByCategory(category:string,subcategories:string[]):Promise<Product[]>{
  //const subcategories = await getSubCategories(category);

  const requests = subcategories.map((sub:string) => 
  firestore.collection('products')
    .where('subcategory', '==', sub)
    .limit(4)
    .get()
  );

  const snapshots = await Promise.all(requests);

  const filtredProducts = snapshots.map((snapshot)=>snapshot.docs.map(doc=>mapFirestoreProduct(doc.id,doc.data())));

  return filtredProducts != undefined ? filtredProducts.flat() : [];
  
}

export async function getFeaturedProducts():Promise<Product[]>{
  return getProductsByProperty('featured',true);
  
}
//Para nuevos ingresos
export async function getNew():Promise<Product[]>{
  return getProductsByProperty('new',true);
  
}

async function getProductsByProperty(property:string, value:any): Promise<Product[]>{
   try{
    const snapshot = await firestore.collection('products').where(property, '==', value).get()
    
    const toRet:Product[] = snapshot.docs.map((doc)=>mapFirestoreProduct(doc.id,doc.data()))
    
    return toRet;
  } catch(error) {
    console.error(`Error on fetch from ${property}`);
    return [];
  }
}


export async function getSubCategories(category:string): Promise<string[]>{
  
  const categories = await getCategories();
  var toRet:string[] = [];
  for(let i:number = 0; i<categories.length; i++){
    if(categories[i].name === category){
      toRet = categories[i].subcategories;
      break;
    }
  }

  return toRet;
}

export async function getAllSubcategories(): Promise<any[]>{
    const categories = await getCategories();
    const toRet = categories.map((category)=>{return category.subcategories});
    return toRet.flat();
}

/*
    En algún momento haré las funciones de userManagement
 */