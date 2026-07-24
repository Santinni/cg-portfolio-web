import type { ReactNode } from "react";

import styles from "./Article.module.css";

export type CalloutTone = "info" | "success" | "warning" | "danger";

export interface CalloutProps {
  children: ReactNode;
  title?: string;
  tone?: CalloutTone;
}

const toneClasses: Record<CalloutTone, string> = {
  danger: styles.calloutDanger,
  info: styles.calloutInfo,
  success: styles.calloutSuccess,
  warning: styles.calloutWarning,
};

export function Callout({ children, title, tone = "info" }: CalloutProps) {
  return (
    <aside className={`${styles.callout} ${toneClasses[tone]}`} aria-label={title ?? "Poznámka"}>
      <span className={styles.calloutIcon} aria-hidden="true">i</span>
      <div className={styles.calloutContent}>
        {title ? <strong>{title}</strong> : null}
        {children}
      </div>
    </aside>
  );
}
