"use client"
import { useState } from "react";
import styles from "./success.module.css";
import { confirmPurchase, ResponseConfirm } from "@/lib/client/cart/cartHandler";
import { Copy, Check } from "lucide-react";

export default function Succes({response}:{response:ResponseConfirm}){
    return (
    <div>
        {response && !response.error ? (
            <div className={styles.success_card}>
                <h2 className={styles.title}>¡Recibimos tu Pedido!</h2>
                <p className={styles.subtitle}>
                    Ya recibimos tu pedido. Vamos a continuar por Whatsapp para finalizar con el pago y los datos del envío.
                </p>

                <a 
                    href="https://wa.me/542923464460" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.whatsapp_link}
                >
                    Ir a WhatsApp
                </a>
            </div>
        ) : ""}
    </div>
);
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Resetea el texto tras 2 segundos
        } catch (err) {
            console.error("Error al copiar al portapapeles", err);
        }
    };

    return (
        <button type="button" className={styles.copy_btn} onClick={handleCopy}>
            {copied ? <Check size={15}/> : <Copy size={15}/>}
        </button>
    );
}