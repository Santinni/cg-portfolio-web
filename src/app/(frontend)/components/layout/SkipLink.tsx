import styles from "./SkipLink.module.css";

export function SkipLink() {
  return (
    <a className={styles.skipLink} href="#main-content">
      Přeskočit na hlavní obsah
    </a>
  );
}
