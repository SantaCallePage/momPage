'use client';

import { ErrorItem } from "@/models/cart";
import { useRouter } from "next/navigation";
export interface InsufficientStockItem {
  id: string;
  title: string;
  requestedQty: number;
  availableStock: number;
}

interface Props {
  items: ErrorItem[];
  isOpen: boolean;
  onKeepAvailable: (id: string, variant: string) => void;
  remove: (id: string, variant: string) => void;
  onClose: () => void;
}

export default function StockWarningModal({
  items,
  isOpen,
  onKeepAvailable,
  remove,
  onClose,
}: Props) {

  const router = useRouter();

  const handleBackToProduct = (item: ErrorItem) => {
    remove(item.id, item.variantName)
    router.push(`/product/${item.id}`)
  }
  if (!isOpen || items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl"/* dark:bg-gray-900"*/>

        {/* Cabecera */}
        <div className="border-b border-gray-100 p-6"/* dark:border-gray-800"*/>
          <h3 className="text-l font-bold text-gray-900"/* dark:text-white"*/>
            No hay suficiente stock
          </h3>
          <p className="mt-1 text-3xl text-gray-600 "/*dark:text-gray-400"*/>
            { items.length == 1 ? "Este producto en el carrito no tiene disponible":"Estos productos en tu carrito no tienen"} la cantidad que solicitaste.
          </p>
          <p className="mt-1 text-3xl text-gray-600 "/*dark:text-gray-400"*/>
            Podés eliminarlo{ items.length == 1 ? "":"s"} del carrito o elegir otra cantidad dentro del Stock disponible
          </p>
        </div>

        {/* Lista con scroll si excede la pantalla */}
        <div className="divide-y divide-gray-100 overflow-y-auto p-6"/* dark:divide-gray-800"*/>
          {items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900"/* dark:text-white"*/>
                    {`${item.name}  ${item.variantName}`}
                  </h4>
                  <div className="flex flex-col text-l text-gray-500 dark:text-gray-400">
                    <span> Pedido: <span className="font-medium text-red-500">{item.requestedQuantity}</span></span>
                    {item.available > 0 ? <span className="font-medium"> {"Disponible:"}  <span className="text-green-600"> {item.available} </span> </span> : <span>No queda stock disponible</span>}
                  </div>
                </div>

                {/* Botones de acción por producto */}
                <div className="mt-3 flex items-center gap-2 sm:mt-0">
                  <button

                    onClick={() => remove(item.id, item.variantName)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-2xl font-medium text-red-600 transition hover:bg-red-50 " /*dark:border-red-900/40 dark:hover:bg-red-950/30"*/
                  >
                    Sacar del Carrito
                  </button>
                  <button 
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-2xl font-medium text-white transition hover:bg-gray-800"/* dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"*/
                    onClick={() => handleBackToProduct(item)} > Volver al Producto</button>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 p-4"/* dark:border-gray-800"*/>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-xl font-medium text-gray-700 transition hover:bg-gray-50 "/* dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"*/
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}