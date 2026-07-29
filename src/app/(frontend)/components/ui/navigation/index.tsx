'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Suspense, useEffect, useId, useRef, useState } from 'react'

import { ThemeToggle } from '@/app/(frontend)/components/theme/ThemeToggle'
import LanguageSwitcher from '@/app/(frontend)/components/ui/languageSwitcher'
import { siteConfig } from '@/content/site'
import { Link, usePathname } from '@/i18n/navigation'

import { IconButton } from '../../primitives/iconButton'
import styles from './Navigation.module.css'

const navItems = [
	{ key: 'work', href: '/work' },
	{ key: 'experience', href: '/experience' },
	{ key: 'about', href: '/about' },
	{ key: 'contact', href: '/contact' },
	{ key: 'insights', href: '/insights' },
] as const

function isCurrentPath(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Responsive site navigation with a desktop menu and a mobile dialog.
 * Uses the native `<dialog>` element for the mobile menu so Escape closes
 * it natively; the `close` event keeps React state and focus in sync.
 */
export default function Navigation() {
	const t = useTranslations('navigation')
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const dialogRef = useRef<HTMLDialogElement>(null)
	const id = useId()

	const openMenu = () => {
		const dialog = dialogRef.current
		if (!dialog || dialog.open) return

		dialog.showModal()
		setIsOpen(dialog.open)
	}

	const closeMenu = () => {
		const dialog = dialogRef.current
		if (!dialog?.open) return

		dialog.close()
		setIsOpen(dialog.open)
	}

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return

		const handleClose = () => {
			setIsOpen(dialog.open)
		}

		dialog.addEventListener('close', handleClose)
		return () => dialog.removeEventListener('close', handleClose)
	}, [])

	useEffect(() => {
		const desktopMedia = window.matchMedia('(min-width: 1024px)')
		const handleDesktopBreakpoint = (event: MediaQueryListEvent) => {
			const dialog = dialogRef.current
			if (!event.matches || !dialog?.open) return

			dialog.close()
			setIsOpen(dialog.open)
		}

		desktopMedia.addEventListener('change', handleDesktopBreakpoint)
		return () => desktopMedia.removeEventListener('change', handleDesktopBreakpoint)
	}, [])

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 0)

		handleScroll()
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
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
			<nav className={styles.nav} data-scrolled={isScrolled}>
				<div className={styles.menuWrapper}>
					<Link
						href="/"
						className={styles.logo}
						aria-label={t('homeLabel', { brand: siteConfig.brand })}
						aria-current={pathname === '/' ? 'page' : undefined}
					>
						<span className={styles.logoText}>{siteConfig.brand}</span>
					</Link>

					<div className={styles.desktopMenu}>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={styles.navLink}
								aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
							>
								{t(`items.${item.key}`)}
							</Link>
						))}
						<Suspense fallback={null}>
							<LanguageSwitcher />
						</Suspense>
						<ThemeToggle />
					</div>
					<div className={styles.menuTrigger}>
						<IconButton
							onClick={openMenu}
							aria-expanded={isOpen}
							aria-controls={id}
							aria-haspopup="dialog"
							aria-label={t('openMenu')}
							variant="quiet"
							size="medium"
						>
							<Menu aria-hidden="true" />
						</IconButton>
					</div>
				</div>
			</nav>
			{/* Mobile dialog menu */}
			<dialog ref={dialogRef} className={styles.mobileMenu} id={id} aria-label={t('siteMenu')}>
				<div className={styles.mobileMenuSurface}>
					<div className={styles.mobileMenuHeader} data-mobile-menu-header="">
						<Link
							href="/"
							className={styles.mobileMenuBrand}
							onClick={closeMenu}
							aria-label={t('homeLabel', { brand: siteConfig.brand })}
							aria-current={pathname === '/' ? 'page' : undefined}
						>
							{siteConfig.brand}
						</Link>
						<div className={styles.mobileMenuActions}>
							<ThemeToggle />
							<IconButton
								autoFocus
								onClick={closeMenu}
								variant="quiet"
								size="medium"
								aria-label={t('closeMenu')}
							>
								<X aria-hidden="true" />
							</IconButton>
						</div>
					</div>
					<nav className={styles.mobileMenuNavigation} aria-label={t('siteMenu')}>
						<ul className={styles.mobileMenuLinks}>
							{navItems.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className={styles.mobileNavLink}
										onClick={closeMenu}
										aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
									>
										{t(`items.${item.key}`)}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					<div className={styles.mobileMenuFooter} data-mobile-menu-footer="">
						<div className={styles.mobileMenuUtilities}>
							<Suspense fallback={null}>
								<LanguageSwitcher />
							</Suspense>
						</div>
						<div className={styles.mobileMenuProfile} data-mobile-menu-profile="">
							<p>{t('mobileMenu.profile.role')}</p>
							<p>{t('mobileMenu.profile.specialties')}</p>
						</div>
					</div>
				</div>
			</dialog>
		</>
	)
}
