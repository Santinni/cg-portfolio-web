import React from "react";
import styles from "./page.module.css";
import { DownloadCloud, Linkedin } from "lucide-react";
import { WhoAmI } from "./sections/who-am-i";
import { TechnologicalStack } from "./sections/tech-stack";
import { Experience } from "./sections/experience";
import { Education } from "./sections/education";
import { Contact } from "./sections/contact";
import { ExpandingButton } from "@/app/(frontend)/components/primitives/expanding-button";

const CurriculumPage = () => {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.headline}>curriculum vitæ</h1>
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
    </>
  );
};

export default CurriculumPage;
