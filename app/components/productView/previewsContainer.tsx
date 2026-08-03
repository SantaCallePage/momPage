import styles from "./productView.module.css"
import Image from "next/image"

interface PreviewsContainerProps{
    currentVariant:string;
    groups:Map<string, string[][]> | undefined;
    currentImageIndex:number;
    scrollRef:React.RefObject<HTMLDivElement | null>;
}

export default function PreviewsContainer({ currentVariant, groups, currentImageIndex, scrollRef }:PreviewsContainerProps){


     function scroll(scroll: number) {
        if (scrollRef.current) {
            // 2. Aplicamos el movimiento
            scrollRef.current.scrollBy({
                left: scroll,
                behavior: 'smooth' // Esto hace que se deslice suavemente
            });
        }
    }

    return(
        <div className={`${styles.previews_container} ${styles.scroll_container}`} >
                {currentVariant ?
                    groups?.get(currentVariant)?.map((group: string[], i: number) => {
                        return <div key={`YaNoSeMeOcurrenKeys${group[0]}`} className={`${styles.previews_group} ${styles.scroll_child}`} >
                            {group.map((url, j: number) => {
                                return <Image
                                    className={`${styles.image} cursor-pointer`}
                                    key={url + url}
                                    src={url}
                                    alt="Product image"
                                    width={500}
                                    height={500}
                                    onClick={(e) => {
                                        const move = ((i * 4 + j) - currentImageIndex) * scrollRef.current?.offsetWidth!;
                                        scroll(move)
                                    }}
                                />
                            })}
                        </div>
                    })
                    : ""}
            </div>
    );
}