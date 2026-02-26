'use client'

import clsx from 'clsx'
import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '../../primitives/button'
import styles from './BookingModal.module.css'

const BOOKING_URL =
	'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1C4Xr8kHc-vu8Mr9Yivuejsv52uG4U0TwcpvlKKx68ItOEY9ZN5yiWwbNHOUPMPGqaFHSL8Dbb?gv=true'

/** Focusable element selector for focus trapping */
const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'

/**
 * Modal component for booking appointments via Google Calendar.
 * Opens a full-screen overlay with an embedded calendar iframe.
 *
 * Accessibility features:
 * - Focus trapping within the modal while open
 * - Escape key closes the modal
 * - Focus restoration to the trigger element on close
 * - Body scroll lock while modal is open
 */
const BookingModal = () => {
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const dialogRef = useRef<HTMLDivElement>(null)
	const closeButtonRef = useRef<HTMLButtonElement>(null)

	const closeModal = useCallback(() => {
		setIsOpen(false)
	}, [])

	const openModal = useCallback(() => {
		setIsOpen(true)
	}, [])

	// Focus the close button when the modal opens
	useEffect(() => {
		if (isOpen) {
			// Small delay to ensure the DOM is rendered
			requestAnimationFrame(() => {
				closeButtonRef.current?.focus()
			})
		}
	}, [isOpen])

	// Restore focus to trigger on close & lock body scroll
	useEffect(() => {
		if (isOpen) {
			const previousOverflow = document.body.style.overflow
			const triggerElement = triggerRef.current
			document.body.style.overflow = 'hidden'

			return () => {
				document.body.style.overflow = previousOverflow
				triggerElement?.focus()
			}
		}
	}, [isOpen])

	// Escape key handler & focus trapping
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeModal()
				return
			}

			if (e.key === 'Tab') {
				const dialog = dialogRef.current
				if (!dialog) return

				const focusableElements = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
				if (focusableElements.length === 0) return

				const firstElement = focusableElements[0]
				const lastElement = focusableElements[focusableElements.length - 1]

				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault()
						lastElement.focus()
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault()
						firstElement.focus()
					}
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, closeModal])

	return (
		<>
			<Button ref={triggerRef} onClick={openModal}>
				Book an Appointment
			</Button>

			{isOpen && (
				<div
					ref={dialogRef}
					className={clsx(styles.modalOverlay)}
					onClick={closeModal}
					role="dialog"
					aria-modal="true"
					aria-label="Book an Appointment"
				>
					<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
						<iframe
							src={BOOKING_URL}
							style={{ border: 0 }}
							width="100%"
							height="100%"
							title="Google Calendar Appointment Scheduling"
						/>
					</div>
					<Button
						ref={closeButtonRef}
						className={styles.modalClose}
						onClick={closeModal}
						variant="transparent"
						aria-label="Close booking modal"
					>
						<X />
					</Button>
				</div>
			)}
		</>
	)
}

export default BookingModal
