"use client";

import styles from "./WhoAmI.module.css";
import ExpandableText from "@/app/(frontend)/components/primitives/expandableText";

export const WhoAmI = () => {
  const data = [
    "Mid-level frontend developer focused on usability, performance and scalability. Bringing web applications to life with React, Next.js and HTMX.",
    "With over eight years of experience, currently I am specializing in React and Next.js development.",
    "I focus on building high-quality web applications with modern technologies, delivering scalable, accessible, and high-performance solutions.",
    "In recent roles, I've designed and documented reusable UI components and design systems using tools like Storybook and RadixUI. My work spans complex frontend architectures, particularly in industries like B2C energy, where adaptability, performance, and sustainability are critical.",
    "I thrive on collaboration, clear communication, and delivering reliable solutions. Fluent in English and with beginner-level Swedish, I am committed to continuous learning and professional growth. I bring a combination of technical excellence, problem-solving skills, and a dedication to teamwork to every project.",
  ];

  return (
    <section className={styles.whoAmI}>
      <h2 className={styles.sectionTitle}>Who am I?</h2>
      <ExpandableText>
        <div className={styles.textWrapper}>
          {data.map((content, index) => (
            <p className={styles.whoAmIText} key={index}>
              {content}
            </p>
          ))}
        </div>
      </ExpandableText>
    </section>
  );
};
