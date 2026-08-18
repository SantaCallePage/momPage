import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {ArrowUpRight, SquareChevronDown } from "lucide-react"
import styles from "./categoriesSection.module.css"
import Link from 'next/link';

interface CustomDetailsProps {
  summaryText: string;
  children: React.ReactNode;
  isAbsolute?: boolean;
  summaryHref?:string,
}

export default function DropDownDetails({ summaryText ,summaryHref ,children, isAbsolute = false }:CustomDetailsProps)  {
  const [isOpen, setIsOpen] = useState(false);

      const ref = useRef<HTMLDivElement>(null);
  
      useEffect(() => {
          // Si el menú no está abierto, no gastamos CPU escuchando eventos
  
          const handleClickOutside = (e: MouseEvent) => {
              if (ref.current && !ref.current.contains(e.target as Node)) {
                  setIsOpen(false);
              }
          };
  
          const handleScroll = () => {
              setIsOpen(false);
          };
  
          document.addEventListener('click', handleClickOutside);
          //window.addEventListener('scroll', handleScroll);
          
          return () => {
              document.removeEventListener('click', handleClickOutside);
              //window.removeEventListener('scroll', handleScroll);
          };
      }, []);
  // Variantes con tipado explícito para evitar errores de TypeScript
  const contentVariants: Variants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.5, ease: 'easeInOut' },
        opacity: { duration: 0.3 }
      }
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.5, ease: 'easeInOut' },
        opacity: { duration: 0.7, delay: 0.1 }
      }
    }
  };

  const iconVariants: Variants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  // Tipamos el objeto con React.CSSProperties para solucionar el error del position
  const containerStyle: React.CSSProperties = isAbsolute 
    ? { position: 'absolute', zIndex: 10, left: "-20%" } 
    : {  };

  return (
    <motion.div className={`${styles.details}`} ref={ref} style={{position: "relative"}}>
      {/* Botón que actúa como el <summary> */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          outline: 'none',
          gap:'20px',
          background: 'transparent'
        }}
        aria-expanded={isOpen}
      >
        {summaryHref ? <Link className={`${styles.summary}`} href={summaryHref}>{summaryText} <ArrowUpRight/> </Link> : <span className={`${styles.summary}`} >{summaryText}</span>}
        
        <motion.span
          variants={iconVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
          style={{ display: 'inline-block', marginRight: '8px' }}
        >
          <SquareChevronDown/>
        </motion.span>
        
      </button>

      {/* Control de presencia para desmontar el contenido al cerrarse */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ overflow: 'hidden' }}
          >
            <div className={`${styles.details_content} ${styles.details}`} style={{ ...containerStyle ,padding: '15px', borderTop: '1px solid #eee' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

