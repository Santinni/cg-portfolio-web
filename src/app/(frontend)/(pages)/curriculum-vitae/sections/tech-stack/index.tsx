"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./technological-stack.module.css"

export const TechnologicalStack = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className={styles.stack}>
      <button className={styles.accordionHeader} onClick={() => setIsOpen(!isOpen)}>
        <h2 className={styles.sectionTitle}>Technological stack</h2>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      <div className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}>
        <div className={styles.category}>
          <h3>JS Frameworks, Libraries and tools</h3>
          <ul className={styles.list}>
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
        </div>

        <div className={styles.category}>
          <h3>Styling & Design Systems</h3>
          <ul className={styles.list}>
            <li>CSS3</li>
            <li>HTML5</li>
            <li>Sass a LESS</li>
            <li>JSS, styled-components, CSS modules</li>
            <li>UI libraries: Mantine, React Bootstrap, MUI</li>
            <li>Storybook</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

