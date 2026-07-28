import Image from 'next/image'

import type { Media, Project } from '@/payload-types'

import styles from './Projects.module.css'

/** Props for the {@link Projects} section. */
interface ProjectsProps {
	data: Project[]
}

/**
 * Projects section — displays a grid of portfolio project cards
 * with images, descriptions, and technology tags.
 */
export default function Projects({ data }: ProjectsProps) {
	return (
		<section className={styles.section} id="projects" aria-labelledby="projects-heading">
			<div className={styles.container}>
				<h2 id="projects-heading" className={styles.title}>
					What I&apos;ve Accomplished
				</h2>
				<div className={styles.grid}>
					{data.map((project) => {
						const imageUrl =
							typeof project.image === 'object' && project.image !== null
								? (project.image as Media).url
								: ''

						return (
							<div key={project.id} className={styles.project}>
								<div className={styles.imageContainer}>
									{imageUrl && (
										<Image
											src={imageUrl}
											alt={project.title}
											fill
											className={styles.image}
											sizes="(max-width: 768px) 100vw, 50vw"
										/>
									)}
								</div>
								<div className={styles.content}>
									<h3 className={styles.projectTitle}>{project.title}</h3>
									<p className={styles.description}>{project.description}</p>
									<div className={styles.tags}>
										{project.technologies?.map((tech) => (
											<span key={tech.id ?? tech.technology} className={styles.tag}>
												{tech.technology}
											</span>
										))}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
