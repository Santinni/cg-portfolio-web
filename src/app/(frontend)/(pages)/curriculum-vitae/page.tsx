import React from 'react';

import { DownloadCloud } from 'lucide-react';

import {
  ExpandingButton,
} from '@/app/(frontend)/components/primitives/expandingButton';

import styles from './page.module.css';
import { Contact } from './sections/contact';
import { Education } from './sections/education';
import { Experience } from './sections/experience';
import { TechnologicalStack } from './sections/tech-stack';
import { WhoAmI } from './sections/who-am-i';

export const CurriculumPage = () => {
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
