"use client";

import { useState } from "react";

import styles from "./Article.module.css";

export interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

export function CodeBlock({ code, label = "Ukázka kódu", language = "text" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setFailed(false);
    } catch {
      setCopied(false);
      setFailed(true);
    }
  };

  return (
    <figure className={styles.codeBlock} aria-label={label}>
      <figcaption className={styles.codeHeader}>
        <span className={styles.codeLanguage}>{language}</span>
        <button
          className={`${styles.action} ${styles.actionSecondary}`}
          type="button"
          onClick={copyCode}
        >
          {copied ? "Zkopírováno" : "Kopírovat"}
        </button>
      </figcaption>
      <div className={styles.codeScroll} tabIndex={0} aria-label="Posuvná ukázka kódu">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
      <span className={styles.visuallyHidden} aria-live="polite">
        {failed ? "Kód se nepodařilo zkopírovat." : copied ? "Kód byl zkopírován." : ""}
      </span>
    </figure>
  );
}
