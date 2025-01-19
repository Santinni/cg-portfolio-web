"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./Navigation.module.css";
import Image from "next/image";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.wrapper}>
        <Link href="/" className={styles.logo}>
          <Image src="/kklogo.svg" alt="Logo" width={40} height={40} />
          Karel Kutchan
        </Link>

        <div className={styles.desktopMenu}>
          <Link href="/#about" className={styles.link}>
            About
          </Link>
          <Link href="/#services" className={styles.link}>
            Services
          </Link>
          <Link href="/#projects" className={styles.link}>
            Projects
          </Link>
          <Link href="/curriculum-vitae" className={styles.link}>
            CV
          </Link>
          <Link href="/#contact" className={styles.button}>
            Contact
          </Link>
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <Link href="/about" className={styles.mobileLink}>
              About
            </Link>
            <Link href="/services" className={styles.mobileLink}>
              Services
            </Link>
            <Link href="/projects" className={styles.mobileLink}>
              Projects
            </Link>
            <Link href="/curriculum-vitae" className={styles.mobileLink}>
              CV
            </Link>
            <button className={styles.mobileLink}>Contact</button>
          </div>
        </div>
      )}
    </nav>
  );
}
