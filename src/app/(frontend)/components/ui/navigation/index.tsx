"use client";

import {
  ReactNode,
  useId,
  useRef,
  useState,
} from 'react';

import {
  Home,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../../primitives/button';
import styles from './Navigation.module.css';

const navItems: { label: string; href: string; icon: ReactNode | null }[] = [
  { label: "Home", href: "/", icon: <Home /> },
  { label: "Services", href: "/#services", icon: null },
  { label: "About", href: "/#about", icon: null },
  // { label: "Projects", href: "/#projects", icon: null },
  { label: "Contact", href: "/#contact", icon: null },
  { label: "CV", href: "/curriculum-vitae", icon: null },
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
        <div className={styles.menuWrapper}>
          <Link href="/" className={styles.logo}>
            <Image src="/kklogo.svg" alt="Logo" width={40} height={40} />
            Karel Kutchan
          </Link>

          <div className={styles.desktopMenu}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.icon ? item.icon : item.label}
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
            rounded
          >
            <Menu
              className={`${styles.menuIcon} ${isOpen ? styles.open : ""}`}
            />
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
            rounded
          >
            <X className={styles.menuIcon} />
          </Button>
        </div>
        <div className={styles.mobileMenuContent}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={toggleMenu}
            >
              {item.icon ? item.icon : item.label}
            </Link>
          ))}
        </div>
      </dialog>
    </>
  );
}
