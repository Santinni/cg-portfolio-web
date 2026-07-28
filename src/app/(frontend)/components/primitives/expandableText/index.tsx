'use client'

import { ChevronDownIcon } from 'lucide-react'
import { type FC, type PropsWithChildren, useId, useState } from 'react'

import { Button } from '../button'
import styles from './ExpandableText.module.css'

/**
 * Expandable/collapsible text container with animated reveal.
 * Provides accessible toggle control with proper ARIA attributes.
 */
const ExpandableText: FC<PropsWithChildren> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false)
	const contentId = useId()

	return (
		<div className={styles.expandableText}>
			<div
				id={contentId}
				className={`${styles.expandableTextBody} ${isOpen ? styles.open : ''}`}
				role="region"
				aria-hidden={!isOpen}
			>
				{children}
			</div>
			<Button
				className={styles.trigger}
				onClick={() => setIsOpen(!isOpen)}
				variant="transparent"
				rounded
				aria-expanded={isOpen}
				aria-controls={contentId}
				aria-label={isOpen ? 'Show less' : 'Show more'}
			>
				<ChevronDownIcon className={styles.triggerIcon} />
			</Button>
		</div>
	)
}

export default ExpandableText
