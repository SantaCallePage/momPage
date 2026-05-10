"use client"
import { useEffect, useState } from "react";
import { useCart } from "../contexts/cartContext";
import { Address, CustomerData, PersonalData } from "@/models/customer";
import { confirmPurchase } from "@/lib/client/cart/cartHandler";

interface dataType{
    "name":string, 
    "contactNumber":string, 
    "contactMail":string
    "locality":string,
    "number":string,
    "province":string,
    "street":string,
    "zipCode":string,
    "apt"?:string,
    "floor"?:string,
    "additional"?:string
}

export default function Buy() {
    const { simpliedCart, reset } = useCart();
    const [data, setData] = useState<dataType>({
        "name":"", 
        "contactNumber":"", 
        "contactMail":"",
        "locality":"",
        "number":"",
        "province":"",
        "street":"",
        "zipCode":"",
         "apt":"",
        "floor":"",
        "additional":""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const personal_data_fields = ["name", "contactNumber", "contactMail"];
    const dir_fields = ["street", "number", "locality", "province", "zipCode", "floor", "apt", "additional"];

    const personal_data_placeholders = ["Nombre", "Número de contacto", "Mail"];
    const dir_placeholders = ["Calle", "Número", "Ciudad", "Provincia", "Código Postal", "Piso (Opcional)", "Departamento (Opcional)", "Información adicional (Opcional)"];

    const [response ,setResponse] = useState<string>("");

    function isNumeric(val: string): boolean {
        return /^\d+$/.test(val);
    };

    function validateMail(mail: string): boolean {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail);
    }

    function addToData(name: string, value: string) {
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        setData({ ...data, [name]: value });
    }
    //Una vez termine este componente, esta función la voy a mudar a una clase de servicio
    function getErrorText(name: string, val: string): string {
        let toRet = "";
        const value = val;
        if (!value) {

            toRet = "Este campo no puede estar vacío"
        }

        switch (name) {
            case dir_fields[1]:
            case personal_data_fields[1]:
                if (!isNumeric(value)) {
                    toRet = "Este campo debe contener un número";
                }
                break;
            case personal_data_fields[2]:
                if (!validateMail(value)) {
                    toRet = "Mail inválido";
                }
                break;
            case dir_fields[4]:
                console.log(`Value: ${value}Lenght ${value.length}`)
                if (value.length != 4) {
                    toRet = "Este campo debe tener 4 digitos";
                }
                break;
        }
        console.log(` toRet: ${toRet}`)
        return toRet;
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        let valueTrim = value.trim();

        const errorText = getErrorText(name, valueTrim);

        if (!errorText) {
            addToData(name, valueTrim);

        } else {
            setErrors({ ...errors, [name]: errorText});
        }

    }

    async function handleSubmit() {
        let isError = false;
        for (let key of Object.keys(data)) {
            if(key == "apt" || key == "floor" || key == "aditional"){
                continue;
            }
            const rawValue = data[key as keyof typeof data];
            const value = String(rawValue ?? "");
            const errorText = getErrorText(key, value.trim());

            if (errorText) {
               setErrors({ ...errors, [key]: errorText});
                isError = true;
            } 
        }

        if(!isError){
            const personalData:PersonalData = {
                name: data.name,
                contactMail: data.contactMail,
                contactNumber: data.contactNumber

            }

            const addressData:Address = {
                locality:data.locality,
                number:data.number,
                province:data.province,
                street:data.street,
                zipCode:data.zipCode,
                apt:data.apt,
                floor:data.floor,
                additional:data.additional
            }

           /* const customerData:CustomerData = {
                address: addressData,
                personalData: personalData
            }

            console.log(JSON.stringify({simpliedCart:simpliedCart, customerData: customerData}))
        */
            setResponse( await confirmPurchase(simpliedCart, {personalData:personalData, address:addressData}));

        }
    }

    useEffect(() => {
        console.table(errors)
    }, [errors]);

    return (
        <main>
            <h2>Para finalizar la compra, completá los siguentes datos</h2>
            <div onSubmit={handleSubmit}>
                <span>Datos personales</span>
                {personal_data_fields.map((name, i) =>
                    <div
                        key={name}
                    >
                        <input
                            type="text"
                            placeholder={`${personal_data_placeholders[i]}`}
                            name={name}
                            onBlur={handleBlur}
                        />
                        <span>{errors[name] ? errors[name] : ""}</span>
                    </div>)}
                <span>Dirección</span>
                {dir_fields.map((name, i) =>
                    <div
                        key={name}
                    >
                        <input
                            type="text"
                            placeholder={`${dir_placeholders[i]}`}
                            name={name}
                            onBlur={handleBlur}
                        />
                        <span>{errors[name] ? errors[name] : ""}</span>
                    </div>)}
                <button onClick={handleSubmit} >Enviar</button>
            </div>
            <span>{response ? `Respuesta del servidor: ${response}`:""}</span>
        </main>
    );
}