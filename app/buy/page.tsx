"use client"
import { useEffect, useRef, useState } from "react";
import { useCart } from "../contexts/cartContext";
import { CustomerData, PersonalData } from "@/models/customer";
import { confirmPurchase, ResponseConfirm } from "@/lib/client/cart/cartHandler";
import { dir_fields, getErrorText, personal_data_fields } from "@/lib/client/purchase/purchaseServices";
import styles from "./buy.module.css"
import Success from "./success"
import { ShippingData, Address } from "@/models/shipping";

interface dataType {
    "name": string,
    "contactNumber": string,
    "contactMail": string
    "locality": string,
    "number": string,
    "province": string,
    "street": string,
    "zipCode": string,
    "apt"?: string,
    "floor"?: string,
    "additional"?: string
}

export default function Buy() {
    const { simpliedCart, reset } = useCart();
    const [data, setData] = useState<dataType>({
        "name": "",
        "contactNumber": "",
        "contactMail": "",
        "locality": "",
        "number": "",
        "province": "",
        "street": "",
        "zipCode": "",
        "apt": "",
        "floor": "",
        "additional": ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});



    const personal_data_placeholders = ["Nombre y Apellido", "Número de Celular", "Mail"];
    const dir_placeholders = ["Calle", "Número", "Ciudad", "Provincia", "Código Postal", "Piso (Opcional)", "Departamento (Opcional)", "Información adicional (Opcional)"];

    const [response, setResponse] = useState<ResponseConfirm | undefined>(undefined);

    function addToData(name: string, value: string) {
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        setData({ ...data, [name]: value });
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        let valueTrim = value.trim();

        const errorText = getErrorText(name, valueTrim);

        //const errorText = "";
        if (!errorText) {
            addToData(name, valueTrim);

        } else {
            setErrors({ ...errors, [name]: errorText });
        }

    }

    async function handleSubmit() {
        let isError = false;
        for (let key of Object.keys(data)) {
            if (key == "apt" || key == "floor" || key == "aditional") {
                continue;
            }
            const rawValue = data[key as keyof typeof data];
            const value = String(rawValue ?? "");
            const errorText = getErrorText(key, value.trim());

            if (errorText) {
                setErrors({ ...errors, [key]: errorText });
                isError = true;
            }
        }

        if (isError) {
            return;
        }
        const personalData: PersonalData = {
            name: data.name,
            contactMail: data.contactMail,
            contactNumber: data.contactNumber

        }

        const addressData: Address = {
            locality: data.locality,
            number: data.number,
            province: data.province,
            street: data.street,
            apt: data.apt,
            floor: data.floor,
            aditional: data.additional
        }

        const shippingData: ShippingData = {
            zipCode: data.zipCode,
            type:"d",
            address:addressData

        }

        setResponse(await confirmPurchase(simpliedCart,  personalData, shippingData ));
       


    }

    useEffect(() => {
        console.table(errors)
    }, [errors]);

    useEffect(() => {
        if (response && !response.error) {
            reset();
        }


    }, [response]);

    return (
        <main className={`${styles.main_container}`} >
            {!response ? <div className={`${styles.form}`}>
                <h2>Para finalizar la compra, completá los siguentes datos</h2>
                <div className={`${styles.data_section}`} >
                    <span>Datos personales</span>
                    <div className={`${styles.personal_data}`} >

                        {personal_data_fields.map((name, i) =>
                            <div
                                key={name}
                            >
                                <input
                                    type="text"
                                    placeholder={`${personal_data_placeholders[i]}`}
                                    name={name}
                                    onBlur={handleBlur}
                                    className={`${styles.input} ${errors[name] ? styles.error_input : ""}`}
                                />
                                <span>{errors[name] ? errors[name] : ""}</span>
                            </div>)}
                    </div>
                    <span>Dirección de Entrega</span>
                    <div className={`${styles.direction}`}>

                        {dir_fields.map((name, i) =>
                            <div
                                key={name}
                            >
                                <input
                                    type="text"
                                    placeholder={`${dir_placeholders[i]}`}
                                    name={name}
                                    onBlur={handleBlur}
                                    className={`${styles.input} ${errors[name] ? styles.error_input : ""}`}
                                />
                                <span>{errors[name] ? errors[name] : ""}</span>
                            </div>)}
                    </div>
                    <button  onClick={handleSubmit} >Finalizar Compra</button>
                </div>
            </div> :""}

            <div>
               { response ? <Success response={response} /> : ""}
            </div>
        </main>
    );
}