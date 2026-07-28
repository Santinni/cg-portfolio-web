import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import type { About as AboutType, Media } from '@/payload-types'

import styles from './About.module.css'

/** Props for the {@link About} section. */
interface AboutProps {
	data: AboutType
}

/**
 * About section — renders the CMS-managed "About" content
 * with an optional image alongside rich-text copy.
 */
export default function About({ data }: AboutProps) {
	return (
		<section className={styles.section} id="about" aria-labelledby="about-heading">
			<div className={styles.container}>
				<h2 id="about-heading" className={styles.title}>
					{data.title}
				</h2>
				<div className={styles.content}>
					<div className={styles.text}>
						<RichText data={data.content as unknown as SerializedEditorState} />
					</div>
					{data.image && (
						<div className={styles.imageContainer}>
							<Image
								src={(data.image as Media).url || ''}
								alt={(data.image as Media).alt || data.title}
								fill
								className={styles.image}
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
