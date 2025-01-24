"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Home, Menu, X } from "lucide-react";
import styles from "./Navigation.module.css";
import Image from "next/image";
import { Button } from "../../primitives/button";
import { useId } from "react";

const navItems: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  // { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
  { label: "CV", href: "/curriculum-vitae" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();

  const toggleMenu = () => {
    if (!dialogRef.current) return;
    if (dialogRef.current.open) {
      dialogRef.current.close();
      setIsOpen(false);
    } else {
      dialogRef.current.showModal();
      setIsOpen(true);
    }
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
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label === "Home" ? <Home /> : item.label}
              </Link>
            ))}
          </div>
          <Button
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls={id}
            aria-label="Toggle mobile menu"
            variant="transparent"
          >
            <Menu className={`${styles.menuIcon} ${isOpen ? "open" : ""}`} />
          </Button>
        </div>
      </nav>
      {/* Mobile dialog menu */}
      <dialog ref={dialogRef} className={styles.mobileMenu} id={id}>
        <div className={styles.mobileMenuHeader}>
          <Button
            className={styles.menuButton}
            onClick={toggleMenu}
            variant="transparent"
          >
            <X className={styles.menuIcon} />
          </Button>
        </div>
        <div className={styles.mobileMenuContent}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileLink}
              onClick={toggleMenu}
            >
              {item.label === "Home" ? <Home /> : item.label}
            </Link>
          ))}
        </div>
      </dialog>
    </>
  );
}
