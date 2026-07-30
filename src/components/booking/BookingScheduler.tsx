'use client'

import { useState } from 'react'

import styles from './BookingScheduler.module.css'

const PRIVACY_DESCRIPTION_ID = 'booking-privacy-description'
const FALLBACK_TITLE_ID = 'booking-fallback-title'
const FRAME_ID = 'booking-calendar-frame'

export interface BookingSchedulerProps {
	scheduleUrl: string
	emailHref: string
	privacyText: string
	loadLabel: string
	loadingLabel: string
	iframeTitle: string
	fallbackTitle: string
	externalCalendarLabel: string
	emailLabel: string
}

/**
 * Defers the third-party appointment schedule until the visitor explicitly
 * requests it while keeping first-party fallback links available throughout.
 */
export function BookingScheduler({
	scheduleUrl,
	emailHref,
	privacyText,
	loadLabel,
	loadingLabel,
	iframeTitle,
	fallbackTitle,
	externalCalendarLabel,
	emailLabel,
}: BookingSchedulerProps) {
	const [shouldLoadFrame, setShouldLoadFrame] = useState(false)
	const [isFrameLoaded, setIsFrameLoaded] = useState(false)

	return (
		<div className={styles.scheduler} data-booking-scheduler>
			<div className={styles.loadPanel}>
				<p id={PRIVACY_DESCRIPTION_ID} className={styles.privacyText}>
					{privacyText}
				</p>
				{shouldLoadFrame ? (
					!isFrameLoaded ? (
						<p className={styles.loadingStatus} role="status">
							{loadingLabel}
						</p>
					) : null
				) : (
					<button
						className={styles.loadButton}
						type="button"
						data-booking-load
						aria-controls={FRAME_ID}
						aria-describedby={PRIVACY_DESCRIPTION_ID}
						onClick={() => setShouldLoadFrame(true)}
					>
						{loadLabel}
					</button>
				)}
			</div>

			{shouldLoadFrame ? (
				<div className={styles.frameShell}>
					<iframe
						id={FRAME_ID}
						className={styles.frame}
						data-booking-frame
						src={scheduleUrl}
						title={iframeTitle}
						loading="lazy"
						referrerPolicy="strict-origin-when-cross-origin"
						onLoad={() => setIsFrameLoaded(true)}
					/>
				</div>
			) : null}

			<aside className={styles.fallbacks} aria-labelledby={FALLBACK_TITLE_ID}>
				<p id={FALLBACK_TITLE_ID} className={styles.fallbackTitle}>
					{fallbackTitle}
				</p>
				<div className={styles.fallbackLinks}>
					<a
						className={styles.fallbackLink}
						data-booking-external
						href={scheduleUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						{externalCalendarLabel}
					</a>
					<a className={styles.fallbackLink} data-booking-email href={emailHref}>
						{emailLabel}
					</a>
				</div>
			</aside>
		</div>
	)
}
