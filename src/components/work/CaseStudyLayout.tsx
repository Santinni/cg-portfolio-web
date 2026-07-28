import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import type { CaseStudy } from '@/content/work'

import styles from './CaseStudyLayout.module.css'

interface CaseStudyLayoutProps {
  caseStudy: CaseStudy
  nextCase: CaseStudy
}

/** Shared semantic shell for the three launch case studies. */
export function CaseStudyLayout({ caseStudy, nextCase }: CaseStudyLayoutProps) {
  return (
    <article>
      <header className={styles.hero}>
        <Container className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <Link href="/work" className={styles.backLink}>
              <ArrowLeft aria-hidden="true" />
              All work
            </Link>
            <Eyebrow>{caseStudy.eyebrow}</Eyebrow>
            <h1 className={styles.title}>{caseStudy.title}</h1>
            <p className={styles.description}>{caseStudy.description}</p>
          </div>

          <dl className={styles.facts}>
            {caseStudy.role && (
              <div className={styles.fact}>
                <dt>Role</dt>
                <dd>{caseStudy.role}</dd>
              </div>
            )}
            <div className={styles.fact}>
              <dt>Focus</dt>
              <dd>{caseStudy.focus}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Stack</dt>
              <dd>{caseStudy.stack.join(' · ')}</dd>
            </div>
          </dl>
        </Container>
      </header>

      <div className={styles.body}>
        <Container className={styles.sections}>
          {caseStudy.sections.map((section) => (
            <section key={section.eyebrow} className={styles.section}>
              <Eyebrow>{section.eyebrow}</Eyebrow>
              <div className={styles.sectionCopy}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </div>
            </section>
          ))}
        </Container>
      </div>

      <nav className={styles.caseNavigation} aria-label="Case study navigation">
        <Container className={styles.caseNavigationInner}>
          <Link href="/work" className={styles.navigationLink}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>Back to</small>
              All work
            </span>
          </Link>
          <Link
            href={`/work/${nextCase.slug}`}
            className={`${styles.navigationLink} ${styles.nextLink}`}
          >
            <span>
              <small>Next case</small>
              {nextCase.title}
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </Container>
      </nav>
    </article>
  )
}
