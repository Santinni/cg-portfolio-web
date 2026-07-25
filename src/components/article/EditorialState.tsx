import Link from "next/link";

import styles from "./Article.module.css";

export type EditorialStateKind = "empty" | "error" | "loading";

export interface EditorialStateProps {
  actionHref?: string;
  actionLabel?: string;
  description?: string;
  kind: EditorialStateKind;
  title?: string;
}

const defaultTitles: Record<EditorialStateKind, string> = {
  empty: "Zatím tu nejsou žádné články",
  error: "Obsah se nepodařilo načíst",
  loading: "Načítám články",
};

export function EditorialState({
  actionHref,
  actionLabel,
  description,
  kind,
  title = defaultTitles[kind],
}: EditorialStateProps) {
  if (kind === "loading") {
    return (
      <section className={styles.editorialState} aria-busy="true" aria-label={title}>
        <span className={styles.skeleton} />
        <span className={`${styles.skeleton} ${styles.skeletonShort}`} />
      </section>
    );
  }

  return (
    <section className={styles.editorialState}>
      <h2 className={styles.stateTitle}>{title}</h2>
      {description ? <p className={styles.stateDescription}>{description}</p> : null}
      {actionHref && actionLabel ? (
        <Link className={styles.stateAction} href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
