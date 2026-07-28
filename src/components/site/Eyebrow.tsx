import type { ReactNode } from 'react'

import styles from './Eyebrow.module.css'

interface EyebrowProps {
  children: ReactNode
  className?: string
}

/** Small uppercase kicker label used above section headings. */
export function Eyebrow({ children, className }: EyebrowProps) {
  const classes = className ? `${styles.eyebrow} ${className}` : styles.eyebrow

  return <p className={classes}>{children}</p>
}
