export interface SucursalData {
  sucursalId: string;
  address: string;
  name: string;
}

export interface Address {
  street: string;
  number: string;
  locality: string;
  province: string;
  apt?: string;
  floor?: string;
  aditional?: string;
}

export interface ShippingData {
  zipCode: string;
  type:string,
  address?: Address;
  sucursalData?: SucursalData;
}

export interface PersonalData {
  name: string;
  contactNumber: string;
  contactMail: string;
}

export interface Item {
  productId: string;
  product: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  variant: string;
}

export interface Purchase {
  id: string;
  items: Item[];
  date: string;
  personalData: PersonalData;
  shippingData: ShippingData;
}