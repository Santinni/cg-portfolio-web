'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import { usePathname, useRouter } from '@/i18n/navigation'
import type { routing } from '@/i18n/routing'

import styles from './LanguageSwitcher.module.css'

type Locale = (typeof routing.locales)[number]

const localeOptions = ['en', 'cs'] as const satisfies readonly Locale[]

export default function LanguageSwitcher() {
	const locale = useLocale()
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const t = useTranslations('navigation.languages')

	const switchLocale = (nextLocale: Locale) => {
		if (nextLocale === locale) return

		const query = searchParams.toString()
		const hash = window.location.hash
		const href = `${pathname}${query ? `?${query}` : ''}${hash}`
		router.replace(href, { locale: nextLocale })
	}

	return (
		<div className={styles.switcher} aria-label={t('label')} role="group">
			{localeOptions.map((option) => (
				<button
					key={option}
					type="button"
					className={styles.option}
					onClick={() => switchLocale(option)}
					aria-pressed={locale === option}
					aria-label={t('switchTo', { language: t(option === 'en' ? 'english' : 'czech') })}
				>
					{option.toUpperCase()}
				</button>
			))}
		</div>
	)
}
