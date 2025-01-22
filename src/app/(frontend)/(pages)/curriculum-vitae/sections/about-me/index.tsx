"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./who-am-i.module.css";

export const WhoAmI = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.whoAmI}>
      <button
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className={styles.sectionTitle}>Who am I?</h2>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      <div
        className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}
      >
        <p>
          Mid-level frontend developer focused on usability, performance and
          scalability. Bringing web applications to life with React, Next.js and
          HTMX.
        </p>
        <p>
          With over eight years of experience, currently I am specializing in
          React and Next.js development.
        </p>
        <p>
          I focus on building high-quality web applications with modern
          technologies, delivering scalable, accessible, and high-performance
          solutions.
        </p>
        <p>
          In recent roles, I&apos;ve designed and documented reusable UI
          components and design systems using tools like Storybook and RadixUI.
          My work spans complex frontend architectures, particularly in
          industries like B2C energy, where adaptability, performance, and
          sustainability are critical.
        </p>
        <p>
          I thrive on collaboration, clear communication, and delivering
          reliable solutions. Fluent in English and with beginner-level Swedish,
          I am committed to continuous learning and professional growth. I bring
          a combination of technical excellence, problem-solving skills, and a
          dedication to teamwork to every project.
        </p>
      </div>
    </div>
  );
};
