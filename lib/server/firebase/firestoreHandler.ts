import "server-only";
import firestore from './firestoreInitializer';
import firebase from "./firebaseInitializer";
import { Product,Variant } from "@/models/product";
import { Cart, CartItem, CartSimplifiedItem } from "@/models/cart";
import { CustomerData } from "@/models/customer";
import { Category, Subcategory } from "@/models/categories";

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