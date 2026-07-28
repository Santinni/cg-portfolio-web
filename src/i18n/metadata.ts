import type { Metadata } from 'next'

import type { Locale } from 'next-intl'

interface LocalizedMetadataInput {
	locale: Locale
	pathname: `/${string}`
	title: string
	description: string
	openGraphTitle?: string
	openGraphType?: 'article' | 'website'
}

export function getLocalizedPathname(locale: Locale, pathname: `/${string}`): string {
	if (locale === 'en') return pathname
	return pathname === '/' ? '/cs' : `/cs${pathname}`
}

export function createLocalizedMetadata({
	locale,
	pathname,
	title,
	description,
	openGraphTitle = title,
	openGraphType = 'website',
}: LocalizedMetadataInput): Metadata {
	const localizedPathname = getLocalizedPathname(locale, pathname)
	const czechPathname = getLocalizedPathname('cs', pathname)

	return {
		title,
		description,
		alternates: {
			canonical: localizedPathname,
			languages: {
				en: pathname,
				cs: czechPathname,
				'x-default': pathname,
			},
		},
		openGraph: {
			type: openGraphType,
			title: openGraphTitle,
			description,
			locale: locale === 'cs' ? 'cs_CZ' : 'en_US',
			url: localizedPathname,
		},
	}
}
