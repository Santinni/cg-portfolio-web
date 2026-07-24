"use client";

import { useState } from "react";

import styles from "./Article.module.css";

export interface ShareBarProps {
  text?: string;
  title: string;
  url: string;
}

type ShareStatus = "idle" | "copied" | "error";

export function ShareBar({ text, title, url }: ShareBarProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");
  const encodedUrl = encodeURIComponent(url);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const nativeShare = async () => {
    try {
      if (!navigator.share) {
        setStatus("error");
        return;
      }
      await navigator.share({ text, title, url });
      setStatus("idle");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };

  const message =
    status === "copied"
      ? "Odkaz byl zkopírován."
      : status === "error"
        ? "Sdílení se nepodařilo. Zkuste odkaz zkopírovat ručně."
        : "";

  return (
    <div className={styles.shareBar}>
      <p className={styles.shareLabel}>Sdílet článek</p>
      <ul className={styles.shareActions}>
        <li>
          <button className={styles.action} type="button" onClick={nativeShare}>
            Sdílet
          </button>
        </li>
        <li>
          <a
            className={`${styles.action} ${styles.actionSecondary}`}
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <button
            className={`${styles.action} ${styles.actionSecondary}`}
            type="button"
            onClick={copyLink}
          >
            Kopírovat odkaz
          </button>
        </li>
      </ul>
      <p className={styles.status} aria-live="polite" role="status">
        {message}
      </p>
    </div>
  );
}
