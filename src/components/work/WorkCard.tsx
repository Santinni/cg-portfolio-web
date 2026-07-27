import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { WorkItem } from '@/content/work'

import styles from './WorkCard.module.css'

interface WorkCardProps {
  item: WorkItem
}

/** Selected-work card. Renders as a link when a case study exists, otherwise as a static pending card. */
export function WorkCard({ item }: WorkCardProps) {
  const isAvailable = item.status === 'available' && Boolean(item.href)

  return (
    <article className={styles.card}>
      <p className={styles.eyebrow}>{item.eyebrow}</p>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.summary}>{item.summary}</p>
      {item.stack.length > 0 && (
        <p className={styles.stack}>{item.stack.join(' · ')}</p>
      )}
      {isAvailable ? (
        <Link href={item.href as string} className={styles.link}>
          Read case
          <ArrowRight className={styles.linkIcon} aria-hidden="true" />
        </Link>
      ) : (
        <span className={styles.pending}>Case study coming soon</span>
      )}
    </article>
  )
}
