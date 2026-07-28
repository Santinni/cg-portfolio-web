import Link from "next/link";

import styles from "./Article.module.css";
import type { ArticleDate, ArticleTopic } from "./types";

export interface ArticleMetadataProps {
  publishedAt?: ArticleDate;
  readingTime?: string;
  topics?: readonly ArticleTopic[];
  updatedAt?: ArticleDate;
}

export function ArticleMetadata({
  publishedAt,
  readingTime,
  topics = [],
  updatedAt,
}: ArticleMetadataProps) {
  return (
    <div>
      <ul className={styles.metadata} aria-label="Article metadata">
        {publishedAt ? (
          <li className={styles.metadataItem}>
            <span>Published</span>
            <time dateTime={publishedAt.dateTime}>{publishedAt.label}</time>
          </li>
        ) : null}
        {updatedAt ? (
          <li className={styles.metadataItem}>
            <span>Updated</span>
            <time dateTime={updatedAt.dateTime}>{updatedAt.label}</time>
          </li>
        ) : null}
        {readingTime ? <li className={styles.metadataItem}>{readingTime}</li> : null}
      </ul>
      {topics.length ? (
        <ul className={styles.topics} aria-label="Article topics">
          {topics.map((topic) => (
            <li key={topic.href ?? topic.label}>
              {topic.href ? (
                <Link className={styles.topic} href={topic.href}>
                  {topic.label}
                </Link>
              ) : (
                <span className={styles.topic}>{topic.label}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
