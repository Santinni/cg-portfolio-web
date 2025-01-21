"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import styles from "./accordion.module.css";
import { useState } from "react";
import { Button } from "../button";

const Accordion = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.accordion}>
      <div className={styles.accordionHead}>
        <p>
          Mid-level frontend developer focused on usability, performance and
          scalability. Bringing web applications to life with React, Next.js and
          HTMX{isOpen ? "." : "…"}
        </p>
        <Button
          className={styles.accordionTrigger}
          onClick={() => setIsOpen(!isOpen)}
          variant="transparent"
          rounded
        >
          {isOpen ? (
            <ChevronUpIcon className={styles.accordionIcon} />
          ) : (
            <ChevronDownIcon className={styles.accordionIcon} />
          )}
        </Button>
      </div>
      <div className={`${styles.accordionBody} ${isOpen ? styles.open : ""}`}>
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
          In recent roles, I’ve designed and documented reusable UI components
          and design systems using tools like Storybook and RadixUI. My work
          spans complex frontend architectures, particularly in industries like
          B2C energy, where adaptability, performance, and sustainability are
          critical.
        </p>
        <p>
          I thrive on collaboration, clear communication, and delivering
          reliable solutions. Fluent in English and with beginner-level Swedish,
          I am committed to continuous learning and professional growth. I bring
          a combination of technical excellence, problem-solving skills, and a
          dedication to teamwork to every project.
        </p>
        <p>
          I am currently looking for a new challenge and am open to new
          opportunities.
        </p>
      </div>
    </div>
  );
};

export default Accordion;
