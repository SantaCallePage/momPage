import styles from "./hero.module.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className={styles.hero_container}>
      {/* Hero Content */}
      <div className={styles.hero_content}>
        <h1 className={styles.title}>
          Estilo que define tu esencia (Placeholder)
        </h1>
        <p className={styles.description}>
          Descubre nuestra colección exclusiva diseñada para quienes buscan
          autenticidad y calidad en cada detalle.
        </p>

        <div className={styles.cta_container}>
          <Link href="/productos" className={`${styles.btn_base} ${styles.btn_primary}`}>
            Explorar productos
            <ArrowRight className={styles.icon} />
          </Link>
          <Link href="/colecciones" className={`${styles.btn_base} ${styles.btn_secondary}`}>
            Ver colecciones(Placeholder)
          </Link>
        </div>
      </div>

      {/* Bottom Info */}
      <div className={styles.bottom_info}>
        <div className={styles.info_grid}>
          <div>
            <p className={styles.info_title}>Envío gratis</p>
            <p className={styles.info_value}>En pedidos +$50</p>
          </div>
          <div>
            <p className={styles.info_title}>Devoluciones</p>
            <p className={styles.info_value}>30 días garantía</p>
          </div>
          <div>
            <p className={styles.info_title}>Pago seguro</p>
            <p className={styles.info_value}>Todas las tarjetas</p>
          </div>
          <div>
            <p className={styles.info_title}>Soporte</p>
            <p className={styles.info_value}>24/7 disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
}