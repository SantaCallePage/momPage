export interface CustomerData{
    address: Address;
    personalData:PersonalData;
}

export interface Address{
    "locality":string,
    "number":string,
    "province":string,
    "street":string,
    "zipCode":string,
    "apt"?:string,
    "floor"?:string,
    "additional"?:string
}

export interface PersonalData{
    "name":string,
    "contactNumber":string,
    "contactMail":string
}