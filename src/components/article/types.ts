import type { ReactNode } from "react";

export type ArticleCardVariant = "featured" | "standard" | "compact";

export interface ArticleTopic {
  label: string;
  href?: string;
}

export interface ArticleDate {
  dateTime: string;
  label: string;
}

export interface ArticleSummary {
  title: string;
  href: string;
  excerpt?: string;
  image?: ReactNode;
  topics?: readonly ArticleTopic[];
  publishedAt?: ArticleDate;
  updatedAt?: ArticleDate;
  readingTime?: string;
}

export interface TableOfContentsItem {
  id: string;
  label: string;
  level?: 2 | 3 | 4;
}

export interface AuthorData {
  name: string;
  role?: string;
  bio?: string;
  href?: string;
  avatar?: ReactNode;
}
