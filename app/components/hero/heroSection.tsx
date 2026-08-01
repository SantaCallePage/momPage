import styles from "./hero.module.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import wppIcon from "@/assets/whatsapp-icon.svg"
import igIcon from "@/assets/instagram-icon.svg"
import Image from "next/image"
export default function HeroSection() {
  return (
    <div>
      <div className={styles.hero_container}>
        {/* Hero Content */}
        <div className={styles.hero_content}>
          <div>
            <h2 className={styles.title}>
              Streetwear de Diseño Urbano
            </h2>
            <p className={styles.description}>

            </p>

            <div className={styles.cta_container}>
              <Link href="/products" className={`${styles.btn_base} ${styles.btn_primary}`}>
                Explorar productos
                <ArrowRight className={styles.icon} />
              </Link>

            </div>
          </div>
          <p className="max-w-lg">
            Esta tienda está en construcción! Cualquier duda o inconveniente comunicate con nosotros por Whatsapp. Te pedimos disculpas por las molestias
          </p>
        </div>

        {/* Bottom Info */}

      </div>
      <div className={styles.bottom_info}>
        <div className={styles.info_grid}>
          <div>
            <p className={styles.info_title}>Envío gratis</p>
            <p className={styles.info_value}>A partir de $80.000</p>
          </div>
          <div className={styles.icon_container}>
            <a className={styles.social_media_icon} href="https://wa.me/542923464460"
              target="_blank"
              rel="noopener noreferrer" ><Image src={wppIcon} width={50} alt="" /></a>

            <a className={styles.social_media_icon} href="https://www.instagram.com/somossantacalle?igsh=bDRwZDU4bHd6YzZv"
              target="_blank"
            ><Image src={igIcon} width={50} alt="" />
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}