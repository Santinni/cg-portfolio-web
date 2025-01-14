import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>Crafting Reactive Web Solutions</h1>
        <p className={styles.description}>
          Building modern and reliable web applications
        </p>
        <button className={styles.button}>Get Started</button>
      </div>
      <div className={styles.referencesPanel}></div>
    </section>
  );
}
