import styles from "./hero.module.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import wppIcon from "@/assets/whatsapp-icon.svg";
import igIcon from "@/assets/instagram-icon.svg";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className={styles.hero_section}>
      <div className={styles.hero_container}>
        {/* Main Content */}
        <div className={styles.hero_content}>
          <div className={styles.main_column}>
            <h2 className={styles.title}>
              Streetwear de Diseño Urbano
            </h2>

            <div className={styles.cta_container}>
              <Link href="/products" className={`${styles.btn_base} ${styles.btn_primary}`}>
                <span>Explorar productos</span>
                <ArrowRight className={styles.icon} />
              </Link>
            </div>
          </div>

          <div className={styles.notice_card}>
            <div className={styles.notice_badge}>
              <span className={styles.notice_dot}></span>
              <span>Aviso</span>
            </div>
            <p className={styles.notice_text}>
              Esta tienda está en construcción! Cualquier duda o inconveniente comunicate con nosotros por Whatsapp. Te pedimos disculpas por las molestias
            </p>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className={styles.bottom_info}>
          <div className={styles.info_grid}>
            <div className={styles.shipping_info}>
              <p className={styles.info_title}>Envío gratis</p>
              <p className={styles.info_value}>A partir de $80.000</p>
            </div>

            <div className={styles.icon_container}>
              <a
                className={styles.social_media_icon}
                href="https://wa.me/542923464460"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <Image src={wppIcon} width={22} height={22} alt="WhatsApp" />
              </a>

              <a
                className={styles.social_media_icon}
                href="https://www.instagram.com/somossantacalle?igsh=bDRwZDU4bHd6YzZv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image src={igIcon} width={22} height={22} alt="Instagram" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}