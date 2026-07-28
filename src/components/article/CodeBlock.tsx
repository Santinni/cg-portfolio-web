'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import styles from './Article.module.css'

export interface CodeBlockProps {
	code: string
	language?: string
	label?: string
}

export function CodeBlock({ code, label, language = 'text' }: CodeBlockProps) {
	const t = useTranslations('article.code')
	const [copied, setCopied] = useState(false)
	const [failed, setFailed] = useState(false)

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setFailed(false)
		} catch {
			setCopied(false)
			setFailed(true)
		}
	}

	return (
		<figure className={styles.codeBlock} aria-label={label ?? t('label')}>
			<figcaption className={styles.codeHeader}>
				<span className={styles.codeLanguage}>{language}</span>
				<button
					className={`${styles.action} ${styles.actionSecondary}`}
					type="button"
					onClick={copyCode}
				>
					{copied ? t('copied') : t('copy')}
				</button>
			</figcaption>
			<div className={styles.codeScroll} tabIndex={0} aria-label={t('scrollLabel')}>
				<pre>
					<code>{code}</code>
				</pre>
			</div>
			<span className={styles.visuallyHidden} aria-live="polite">
				{failed ? t('copyFailure') : copied ? t('copySuccess') : ''}
			</span>
		</figure>
	)
}
