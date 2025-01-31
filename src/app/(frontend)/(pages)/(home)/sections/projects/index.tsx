import Image from 'next/image';

import {
  Media,
  Project,
} from '@/payload-types';

import styles from './Projects.module.css';

interface ProjectsProps {
  data: Project[];
}

export default function Projects({ data }: ProjectsProps) {
  return (
    <section className={styles.section} id="projects">
      <div className={styles.container}>
        <h2 className={styles.title}>What I&apos;ve Accomplished</h2>
        <div className={styles.grid}>
          {data.map((project, index) => {
            const imageUrl =
              typeof project.image === "object" && project.image !== null
                ? (project.image as Media).url
                : "";

            return (
              <div key={index} className={styles.project}>
                <div className={styles.imageContainer}>
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
                <div className={styles.content}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.description}>{project.description}</p>
                  <div className={styles.tags}>
                    {project.technologies?.map((tech, techIndex) => (
                      <span key={techIndex} className={styles.tag}>
                        {tech.technology}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
