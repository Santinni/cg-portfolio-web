"use client";

import { Moon, Sun } from "lucide-react";

import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const toggleTheme = () => {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("codeguy-theme", nextTheme);
  };

  return (
    <button className={styles.toggle} type="button" onClick={toggleTheme} aria-label="Přepnout barevný motiv">
      <Sun className={`${styles.icon} ${styles.lightIcon}`} aria-hidden="true" />
      <Moon className={`${styles.icon} ${styles.darkIcon}`} aria-hidden="true" />
    </button>
  );
}
