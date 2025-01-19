import Image from "next/image";
import styles from "./Projects.module.css";

interface Project {
  title: string;
  description: string;
  image: {
    url: string;
  };
  link: string;
  technologies: { technology: string }[];
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section className={styles.section} id="projects">
      <div className={styles.container}>
        <h2 className={styles.title}>What I&apos;ve Accomplished</h2>
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.project}>
              <div className={styles.imageContainer}>
                <Image
                  src={project.image.url}
                  alt={project.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>
                <div className={styles.tags}>
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className={styles.tag}>
                      {tech.technology}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
