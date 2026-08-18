"use client"

import { Product, Variant } from "@/models/product"
import { useState, useRef, useMemo } from "react"
import Image from "next/image"
import styles from "./productPreview.module.css"
import Link from "next/link"

interface ProductPreviewProps {
    product: Product
}

export default function ProductPreview(prop: ProductPreviewProps) {
    const [product] = useState(prop.product);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { images, totalStock } = useMemo(() => {
        const tempImages = product.variants ? product.variants.map((variant: Variant) => variant.imagesUrls[0]) : [];
        const stock = product.variants ? product.variants.reduce((acc, currentVariant: Variant) => acc + (currentVariant.stock || 0), 0) : 0;
        return { images: tempImages, totalStock: stock };
    }, [product]);

    function scroll(offset: number) {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: offset,
                behavior: 'smooth'
            });
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const newIndex = Math.round(target.scrollLeft / target.offsetWidth);
        if (newIndex !== currentImageIndex) {
            setCurrentImageIndex(newIndex);
        }
    };

    const hasDiscount = Boolean(product.discountPercentage && product.discountPercentage > 0);
    const discountedPrice = hasDiscount
        ? Math.round(product.price * (1 - product.discountPercentage / 100))
        : product.price;

    return (
        <Link href={`/product/${product.id}`} className={styles.main_container}>
            <div className={styles.image_wrapper}>
                {/* Corner Badges */}
                <div className={styles.badges_container}>
                    {totalStock === 0 ? (
                        <span className={`${styles.badge} ${styles.badge_out_of_stock}`}>Agotado</span>
                    ) : hasDiscount ? (
                        <span className={`${styles.badge} ${styles.badge_discount}`}>-{product.discountPercentage}%</span>
                    ) : product.new ? (
                        <span className={`${styles.badge} ${styles.badge_new}`}>Nuevo</span>
                    ) : null}
                </div>

                {images.length > 1 && (
                    <button
                        type="button"
                        className={`${styles.image_button} ${styles.image_button_left}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scroll(-scrollRef.current!.offsetWidth);
                        }}
                        aria-label="Imagen anterior"
                    >
                        ‹
                    </button>
                )}

                <div ref={scrollRef} onScroll={handleScroll} className={styles.images_container}>
                    {images.map((url: string, index) => (
                        <div key={url + index} className={styles.image_slide}>
                            <Image
                                src={url}
                                className={styles.image}
                                alt={product.name}
                                width={400}
                                height={520}
                                priority={index === 0}
                                unoptimized={true}
                            />
                        </div>
                    ))}
                </div>

                {images.length > 1 && (
                    <button
                        type="button"
                        className={`${styles.image_button} ${styles.image_button_right}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scroll(scrollRef.current!.offsetWidth);
                        }}
                        aria-label="Siguiente imagen"
                    >
                        ›
                    </button>
                )}

                {images.length > 1 && (
                    <div className={styles.dots_container}>
                        {images.map((url: string, index) => (
                            <div
                                key={url + index}
                                className={`${styles.dot} ${index === currentImageIndex ? styles.active_dot : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.info_container}>
                <h3 className={styles.name}>{product.name}</h3>

                <div className={styles.price_row}>
                    {hasDiscount ? (
                        <>
                            <span className={styles.discounted_price}>${discountedPrice.toLocaleString("es-AR")}</span>
                            <span className={styles.original_price}>${product.price.toLocaleString("es-AR")}</span>
                        </>
                    ) : (
                        <span className={styles.price}>${product.price.toLocaleString("es-AR")}</span>
                    )}
                </div>

                <button
                    type="button"
                    className={`${styles.buy_button} ${totalStock === 0 ? styles.buy_button_disabled : ''}`}
                    disabled={totalStock === 0}
                >
                    {totalStock === 0 ? "Sin Stock" : "Ver Producto"}
                </button>
            </div>
        </Link>
    );
}