import Link from "next/link";

import styles from "./Article.module.css";
import type { AuthorData } from "./types";

export interface AuthorContextProps extends AuthorData {
  heading?: string;
}

export function AuthorContext({ avatar, bio, heading = "O autorovi", href, name, role }: AuthorContextProps) {
  return (
    <aside className={styles.author} aria-label={heading}>
      {avatar ? <div className={styles.authorAvatar}>{avatar}</div> : null}
      <div className={styles.authorBody}>
        <p className={styles.eyebrow}>{heading}</p>
        <h2 className={styles.authorName}>
          {href ? <Link href={href}>{name}</Link> : name}
        </h2>
        {role ? <p className={styles.authorRole}>{role}</p> : null}
        {bio ? <p className={styles.authorBio}>{bio}</p> : null}
      </div>
    </aside>
  );
}
