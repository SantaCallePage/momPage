import React from "react";
import styles from "./productView.module.css"
import Image from "next/image";

interface CarouselProps{
    currentVariant:string;
    images:Map<string, string[]> | undefined;
    currentImageIndex:number;
    scrollRef:React.RefObject<HTMLDivElement | null>;
    setCurrentImageIndex(newIndex:number):void;
}


const Carrousel = ({ currentImageIndex, currentVariant, scrollRef, images, setCurrentImageIndex }:CarouselProps)=>{

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        const newIndex = Math.round(target.scrollLeft / target.offsetWidth);

        if (newIndex !== currentImageIndex) {
            setCurrentImageIndex(newIndex)
        }
    };

    return(
        <div className={`${styles.images_dots_container}`}>
                <div className={`${styles.images_container} ${styles.scroll_container}`} ref={scrollRef} onScroll={handleScroll} >{currentVariant ?
                    images?.get(currentVariant)?.map((url) => {
                        return <Image
                            className={`${styles.image} ${styles.scroll_child}`}
                            key={url}
                            src={url}
                            alt="Product image"
                            width={500}
                            height={500}
                        />
                    })
                    : ""}</div>
                <div className={`${styles.dots_container}`} >
                    {
                        images?.get(currentVariant)?.map((url: string, index) => {
                            return <div key={url + index} className={`${styles.dot} ${index == currentImageIndex ? styles.active_dot : ''}`} ></div>
                        })
                    }
                </div>
            </div>
    );
}

export default React.memo(Carrousel);