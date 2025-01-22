import React from "react";
import styles from "./page.module.css";
import { DownloadCloud, Linkedin } from "lucide-react";
import { WhoAmI } from "./sections/about-me";
import { TechnologicalStack } from "./sections/tech-stack";
import { Experience } from "./sections/experience";
import { Education } from "./sections/education";
import { Contact } from "./sections/contact";
import { ExpandingButton } from "@/app/(frontend)/components/primitives/expandingButton";

const CurriculumPage = () => {
  return (
    <main>
      <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.title}>curriculum vitæ</h1>

          <div className={styles.header}>
            <h2 className={styles.name}>Karel Kutchan</h2>
            <p className={styles.profession}>Frontend Developer</p>

            <Contact />
          </div>

          <WhoAmI />

          <TechnologicalStack />

          <Experience />

          <Education />

          <div className={styles.socialLinks}>
            <a
              href="https://www.linkedin.com/in/karelkutchan/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <Linkedin />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </section>

      <ExpandingButton
        href="/curriculum-vitae/CV_Karel_Kutchan.pdf"
        download
        buttonText="Download CV"
        icon={<DownloadCloud className={styles.downloadIcon} />}
        isFloating
      />
    </main>
  );
};

export default CurriculumPage;
