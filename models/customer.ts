export interface CustomerData{
    address: Address;
    personalData:PersonalData;
}

export interface Address{
    "locality":string,
    "number":number,
    "province":string,
    "street":string,
    "zipCode":number,
    "apt"?:string,
    "floor"?:string,
    "additional"?:string
}

export interface PersonalData{
    "name":string,
    "contactNumber":string,
    "contactMail":string
}