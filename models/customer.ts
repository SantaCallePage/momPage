import { Address } from "./shipping"

export interface CustomerData{
    address: Address;
    personalData:PersonalData;
}

export interface PersonalData{
    name:string,
    contactNumber:string,
    contactMail:string
}