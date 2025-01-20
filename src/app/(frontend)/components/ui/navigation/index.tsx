"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./Navigation.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    handleClose();
  }, [pathname]);

  const handleOpen = () => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    setIsOpen(false);
    dialogRef.current?.close();
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.logo}>
            <Image src="/kklogo.svg" alt="Logo" width={40} height={40} />
            Karel Kutchan
          </Link>

          <div className={styles.desktopMenu}>
            <Link
              href="/#about"
              className={styles.link}
              onClick={() => handleClose()}
            >
              About
            </Link>
            <Link
              href="/#services"
              className={styles.link}
              onClick={() => handleClose()}
            >
              Services
            </Link>
            <Link
              href="/#projects"
              className={styles.link}
              onClick={() => handleClose()}
            >
              Projects
            </Link>
            <Link href="/curriculum-vitae" className={styles.link}>
              CV
            </Link>
            <Link
              href="/#contact"
              className={styles.button}
              onClick={() => handleClose()}
            >
              Contact
            </Link>
          </div>

          <button
            className={styles.menuButton}
            onClick={handleOpen}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
          >
            <Menu className={`${styles.menuIcon} ${isOpen ? "open" : ""}`} />
          </button>
        </div>
      </nav>
      <dialog ref={dialogRef} className={styles.mobileMenu} id="mobile-menu">
        <div className={styles.mobileMenuHeader}>
          <button className={styles.menuButton} onClick={handleClose}>
            <X className={styles.menuIcon} />
          </button>
        </div>
        <div className={styles.mobileMenuContent}>
          <Link
            href="/#about"
            className={styles.mobileLink}
            onClick={() => handleClose()}
          >
            About
          </Link>
          <Link
            href="/#services"
            className={styles.mobileLink}
            onClick={() => handleClose()}
          >
            Services
          </Link>
          <Link
            href="/#projects"
            className={styles.mobileLink}
            onClick={() => handleClose()}
          >
            Projects
          </Link>
          <Link href="/curriculum-vitae" className={styles.mobileLink}>
            CV
          </Link>
          <Link
            href="/#contact"
            className={styles.button}
            onClick={() => handleClose()}
          >
            Contact
          </Link>
        </div>
      </dialog>
    </>
  );
}
