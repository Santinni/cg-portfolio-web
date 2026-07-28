import type { Metadata } from 'next'

import LocalizedFrontendLayout, {
	generateMetadata as generateLocalizedMetadata,
	viewport,
} from '@/app/[locale]/(frontend)/layout'

export { viewport }

const englishParams = Promise.resolve({ locale: 'en' })

export function generateMetadata(): Promise<Metadata> {
	return generateLocalizedMetadata({ params: englishParams })
}

export default function EnglishFrontendLayout({ children }: { children: React.ReactNode }) {
	return LocalizedFrontendLayout({ children, params: englishParams })
}
