'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import { ThemeToggle } from '@/app/(frontend)/components/theme/ThemeToggle'
import { primaryNav, siteConfig } from '@/content/site'

import { Button } from '../../primitives/button'
import styles from './Navigation.module.css'

/**
 * Responsive site navigation with a desktop menu and a mobile dialog.
 * Uses the native `<dialog>` element for the mobile menu so Escape closes
 * it natively; the `close` event keeps React state and focus in sync.
 */
export default function Navigation() {
	const [isOpen, setIsOpen] = useState(false)
	const dialogRef = useRef<HTMLDialogElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const id = useId()

	const openMenu = () => {
		dialogRef.current?.showModal()
		setIsOpen(true)
	}

	const closeMenu = () => {
		dialogRef.current?.close()
	}

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return

		const handleClose = () => {
			setIsOpen(false)
			triggerRef.current?.focus()
		}

		dialog.addEventListener('close', handleClose)
		return () => dialog.removeEventListener('close', handleClose)
	}, [])

	useEffect(() => {
		if (!isOpen) return

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = previousOverflow
		}
	}, [isOpen])

	return (
		<>
			<nav className={styles.nav}>
				<div className={styles.menuWrapper}>
					<Link href="/" className={styles.logo} aria-label={`${siteConfig.brand} - Home`}>
						<span className={styles.logoText}>{siteConfig.brand}</span>
					</Link>

					<div className={styles.desktopMenu}>
						{primaryNav.map((item) => (
							<Link key={item.href} href={item.href} className={styles.navLink}>
								{item.label}
							</Link>
						))}
						<ThemeToggle />
					</div>
					<div className={styles.menuTrigger}>
						<ThemeToggle />
						<Button
							ref={triggerRef}
							className={styles.menuButton}
							onClick={openMenu}
							aria-expanded={isOpen}
							aria-controls={id}
							aria-haspopup="dialog"
							aria-label="Open menu"
							variant="transparent"
							rounded
						>
							<Menu className={styles.menuIcon} aria-hidden="true" />
						</Button>
					</div>
				</div>
			</nav>
			{/* Mobile dialog menu */}
			<dialog ref={dialogRef} className={styles.mobileMenu} id={id} aria-label="Site menu">
				<div className={styles.mobileMenuHeader}>
					<Button
						className={styles.menuButton}
						onClick={closeMenu}
						variant="transparent"
						rounded
						aria-label="Close menu"
					>
						<X className={styles.menuIcon} aria-hidden="true" />
					</Button>
				</div>
				<div className={styles.mobileMenuContent}>
					{primaryNav.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={styles.mobileNavLink}
							onClick={closeMenu}
						>
							{item.label}
						</Link>
					))}
				</div>
			</dialog>
		</>
	)
}
