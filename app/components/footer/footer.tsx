import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.gridContainer}>
                    <div className={styles.brandColumn}>
                        <Link href="/" className={styles.brandLogo}>
                            MARQUESSA  REBEL
                        </Link>
                        <p className={styles.brandDescription}>
                            Tu Estilo te hace única (placeholder)
                        </p>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Tienda</h4>
                        <ul className={styles.linkList}>
                            <li>
                                <Link href="/productos" className={styles.linkItem}>
                                    Todos los productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/colecciones" className={styles.linkItem}>
                                    Colecciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/ofertas" className={styles.linkItem}>
                                    Ofertas
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Ayuda</h4>
                        <ul className={styles.linkList}>
                            <li>
                                <Link href="/envios" className={styles.linkItem}>
                                    Envíos
                                </Link>
                            </li>
                            <li>
                                <Link href="/devoluciones" className={styles.linkItem}>
                                    Devoluciones
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Seguinos</h4>
                        <ul className={styles.linkList}>
                            <li>
                                <Link href="/privacidad" className={styles.linkItem}>
                                    Instagram
                                </Link>
                            </li>
                            <li>
                                <Link href="/terminos" className={styles.linkItem}>
                                    TikTok
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © 2026 Marquessa Rebel. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}