import Link from "next/link";

import styles from "./Article.module.css";
import type { ArticleSummary } from "./types";

export function RelatedArticle({ excerpt, href, image, title }: ArticleSummary) {
  return (
    <article className={styles.related}>
      {image ? <div className={styles.relatedMedia}>{image}</div> : null}
      <div className={styles.relatedBody}>
        <h3 className={styles.relatedTitle}>
          <Link href={href}>{title}</Link>
        </h3>
        {excerpt ? <p className={styles.relatedExcerpt}>{excerpt}</p> : null}
      </div>
    </article>
  );
}
