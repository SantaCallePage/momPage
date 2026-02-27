"use client";
import { getBaseUrl } from "@/lib/client/url/urlHandler";
import { SimplifiedCart} from "@/models/cart";
import { useState } from "react";

interface TemporalButtonProps{
    cart: SimplifiedCart;
}

async function handleClick(cart: SimplifiedCart, setColor?: (color: string) => void) {
    const response = await fetch(`${getBaseUrl()}/api/v1/purchases/confirm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              simplifiedCart: cart,
              customerData: { address: {} }
            })
          })

    if (response.ok) {
        const data = await response.json();
        console.log("Purchase confirmed:", data);
        setColor?.('green');
    } else {
        const error = await response.json();
        console.error("Error confirming purchase:", error);
        setColor?.('red');
    }
}

export default function TemporalButton({ cart }: TemporalButtonProps) {
    const [color, setColor] = useState('blue');
    return (
        <button onClick={() =>handleClick(cart, setColor)}>Descontar Stock</button>
    );
}