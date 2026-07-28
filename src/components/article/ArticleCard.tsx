import Link from "next/link";

import styles from "./Article.module.css";
import { ArticleMetadata } from "./ArticleMetadata";
import type { ArticleCardVariant, ArticleSummary } from "./types";

export interface ArticleCardProps extends ArticleSummary {
  headingLevel?: 2 | 3;
  variant?: ArticleCardVariant;
}

export function ArticleCard({
  excerpt,
  headingLevel = 2,
  href,
  image,
  publishedAt,
  readingTime,
  title,
  topics,
  updatedAt,
  variant = "standard",
}: ArticleCardProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const classes = [
    styles.card,
    variant === "featured" ? styles.cardFeatured : "",
    variant === "compact" ? styles.cardCompact : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={classes}>
      {image ? <div className={styles.cardMedia}>{image}</div> : null}
      <div className={styles.cardBody}>
        <Heading className={styles.cardTitle}>
          <Link href={href}>{title}</Link>
        </Heading>
        {variant !== "compact" && excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
        <ArticleMetadata
          publishedAt={publishedAt}
          readingTime={readingTime}
          topics={topics}
          updatedAt={updatedAt}
        />
      </div>
    </article>
  );
}
