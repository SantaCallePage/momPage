import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.gridContainer}>
                    <div className={styles.brandColumn}>
                        <Link href="/" className={styles.brandLogo}>
                            SANTA CALLE
                        </Link>
                        <p className={styles.brandDescription}>
                            Tu Estilo es tu voz
                        </p>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Tienda</h4>
                        <ul className={styles.linkList}>
                            <li>
                                <Link href="/products" className={styles.linkItem}>
                                    Todos los productos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Ayuda</h4>
                        <ul className={styles.linkList}>
                            <li>
                                <Link href="/shipping" className={styles.linkItem}>
                                    Envíos
                                </Link>
                            </li>
                          
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Seguinos</h4>
                        <ul className={styles.linkList}>
                            <li>
                                <a href="https://www.instagram.com/somossantacalle?igsh=bDRwZDU4bHd6YzZv" className={styles.linkItem}>
                                    Instagram
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © 2026 Santa Calle. Todos los derechos reservados.
                    </p>
                    <p className={styles.copyright}>Desarrollado por  
                        <a href="https://www.linkedin.com/in/luca-stombellini-a68402225/"
                         target="_BLANK"
                         rel="noopener noreferrer"> Luca Stombellini</a></p>
                </div>
            </div>
        </footer>
    );
}