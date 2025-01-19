import React from "react";
import styles from "./page.module.css";
import { DownloadCloud } from "lucide-react";
import Accordion from "@/components/primitives/accordion";

const CurriculumPage = () => {
  return (
    <main>
      <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.subtitle}>Karel Kutchan</h1>
          <h1 className={styles.title}>Curriculum Vitae</h1>
          <h2 className={styles.subtitle}>Who am I?</h2>
          <div className={styles.content}>
            <div className={styles.text}>
              <Accordion />
            </div>
          </div>
        </div>
      </section>
      <hr />
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Technological stack</h2>
          <div className={styles.content}>
            <div className={styles.text}>
              <p>JS Frameworks, Libraries and tools</p>
            </div>
          </div>
          <ul>
            <li>React</li>
            <li>Next.js</li>
            <li>TypeScript</li>
            <li>Refine</li>
            <li>MobX, Redux</li>
            <li>React Aria</li>
            <li>Node.js</li>
            <li>Vite, Webpack</li>
            <li>NPM, Yarn, PNPM</li>
            <li>Git</li>
          </ul>
          <div>
            <p>Styling & Design Systems</p>
            <ul>
              <li>CSS3</li>
              <li>HTML5</li>
              <li>Sass a LESS</li>
              <li>JSS, styled-components, CSS modules</li>
              <li>UI libraries: Mantine</li>
            </ul>
          </div>
        </div>
      </section>
      <hr />
      <div className={styles.floatingButton}>
        <a
          className={styles.button}
          href="/curriculum-vitae/CV_Karel_Kutchan.pdf"
          download
        >
          <DownloadCloud className={styles.downloadIcon} />
          <span className={styles.buttonText}>Download CV</span>
        </a>
      </div>
    </main>
  );
};

export default CurriculumPage;
