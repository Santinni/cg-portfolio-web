"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.logo}>
            Karel Kutchan
          </Link>

          <div className={styles.desktopMenu}>
            <Link href="/about" className={styles.link}>
              About
            </Link>
            <Link href="/services" className={styles.link}>
              Services
            </Link>
            <Link href="/projects" className={styles.link}>
              Projects
            </Link>
            <Link href="/cv" className={styles.link}>
              CV
            </Link>
            <button className={styles.button}>Contact</button>
          </div>

          <button
            className={styles.menuButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
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
            <Link href="/cv" className={styles.mobileLink}>
              CV
            </Link>
            <button className={styles.mobileLink}>Contact</button>
          </div>
        </div>
      )}
    </nav>
  );
}
