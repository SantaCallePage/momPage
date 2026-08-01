import { PersonalData } from "./customer"
import { CartItem } from "./cart";
import { ShippingData } from "./shipping";

export interface Purchase {
  id: string;
  items: CartItem[];
  date: string;
  personalData: PersonalData;
  shippingData: ShippingData;
}