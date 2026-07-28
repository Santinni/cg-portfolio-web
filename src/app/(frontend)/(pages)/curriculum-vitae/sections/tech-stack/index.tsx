import ExpandableText from '@/app/(frontend)/components/primitives/expandableText'
import styles from './TechnologicalStack.module.css'

/** Technological stack section — collapsible list of frameworks, libraries and tools. */
export const TechnologicalStack = () => {
	return (
		<>
			<section className={styles.stack} aria-labelledby="techstack-heading">
				<h2 id="techstack-heading" className={styles.sectionTitle}>
					Technological Stack
				</h2>
				<ExpandableText>
					<div className={styles.contentWrapper}>
						<div className={styles.category}>
							<h3>JS Frameworks, Libraries and tools</h3>
							<ul className={styles.list}>
								<li>React</li>
								<li>Next.js</li>
								<li>TypeScript</li>
								<li>Refine</li>
								<li>MobX, Redux</li>
								<li>React Aria</li>
								<li>Node.js</li>
								<li>Vite, Webpack</li>
								<li>NPM, Yarn, PNPM</li>
								<li>Git</li>
							</ul>
						</div>
						<div className={styles.category}>
							<h3>Styling & Design Systems</h3>
							<ul className={styles.list}>
								<li>HTML5</li>
								<li>CSS3+</li>
								<li>Sass</li>
								<li>LESS</li>
								<li>JSS, styled-components, CSS modules</li>
								<li>Mantine, React Bootstrap, MUI…</li>
								<li>Storybook</li>
							</ul>
						</div>
					</div>
				</ExpandableText>
			</section>
		</>
	)
}
