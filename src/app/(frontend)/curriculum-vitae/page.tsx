import React from "react";
import styles from "./page.module.css";
import { DownloadCloud } from "lucide-react";

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
              <p>
                Bringing web applications to life with React – mid-level
                frontend developer focused on usability, performance, and
                scalability.
              </p>
              <p>
                With over eight years of experience, currently I am specializing
                in React and Next.js development.
              </p>
              <p>
                I focus on building high-quality web applications with modern
                technologies, delivering scalable, accessible, and
                high-performance solutions.
              </p>
              <p>
                In recent roles, I’ve designed and documented reusable UI
                components and design systems using tools like Storybook and
                RadixUI. My work spans complex frontend architectures,
                particularly in industries like B2C energy, where adaptability,
                performance, and sustainability are critical.
              </p>
              <p>
                I thrive on collaboration, clear communication, and delivering
                reliable solutions. Fluent in English and with beginner-level
                Swedish, I am committed to continuous learning and professional
                growth. I bring a combination of technical excellence,
                problem-solving skills, and a dedication to teamwork to every
                project.
              </p>
              <p>
                I am currently looking for a new challenge and am open to new
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
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
