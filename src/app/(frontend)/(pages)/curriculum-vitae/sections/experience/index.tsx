import styles from "./experience.module.css"

type ExperienceItem = {
  period: string
  title: string
  company: string
  description: string[]
}

const experiences: ExperienceItem[] = [
  {
    period: "6/2024 – Present",
    title: "Frontend Engineer",
    company: "Freelancer at Kontent.ai",
    description: [
      "I worked as part of a team on a contract-based project focused on improving accessibility and refactoring code to provide users with a better and more accessible user experience.",
      "Our team utilized React Aria, specifically its hooks, and developed custom solutions to address specific accessibility requirements.",
      "My responsibilities included ensuring the application complied with all accessibility standards, collaborating with team members to optimize code, and applying best practices for frontend development.",
    ],
  },
  {
    period: "4/2024 – 9/2024",
    title: "Lead Frontend Engineer",
    company: "Freelancer at TLDR;IT s.r.o.",
    description: [
      "As a Lead Frontend Engineer in a time-framed role, I designed and implemented solutions for web and mobile applications while leading the frontend team.",
      "I proposed technical approaches, developed scalable applications using ReactJS, Next.js, and Storybook, and ensured high-quality, user-friendly results within tight deadlines.",
    ],
  },
  {
    period: "9/2021 – 4/2024",
    title: "Frontend developer",
    company: "eMan a.s.",
    description: [
      "In my role as a mid-level frontend developer at eMan a.s., I focused on developing web applications, user interfaces, and creating design systems and component libraries for key clients like EON, MND, ČEZ, and previously Bohemia Energy.",
      "Development and implementation of user interfaces: I was responsible for developing and implementing innovative user interfaces that served as the foundation for our web applications.",
      "Performance optimization and accessibility: I optimized web applications to improve their performance and accessibility.",
      "Refactoring and modernizing legacy code: I rewrote old code using modern technologies like React, NextJS, and TypeScript.",
    ],
  },
  {
    period: "9/2020 – 9/2021",
    title: "Frontend developer",
    company: "LMC",
    description: [
      "At LMC, I worked as a Frontend Developer in the Custom Design Team, focusing on creating bespoke web solutions for corporate clients.",
      "My responsibilities included delivering tailored web solutions on platforms like jobs.cz, collaborating with designers and clients to analyze requirements and design functional, visually appealing solutions.",
      "I used modern frontend technologies such as HTML, CSS, JavaScript, and React, ensuring responsive design and high performance.",
    ],
  },
  {
    period: "9/2019 – 9/2020",
    title: "Frontend developer",
    company: "Amp X",
    description: [
      "As a Frontend Developer, I worked as part of a software development team on the frontend of a new digital energy platform.",
      "My key responsibilities included delivering a high-quality UI that was accessible, user-friendly, and responsive, while maintaining clean, sustainable, and readable code.",
      "I utilized technologies such as ReactJS, Material-UI, Vanilla JavaScript, HTML5, and CSS-in-JS (JSS) to develop and implement frontend solutions.",
    ],
  },
]

export const Experience = () => {
  return (
    <section className={styles.experience}>
      <h2 className={styles.sectionTitle}>Experience</h2>
      <div className={styles.timeline}>
        {experiences.map((exp, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>{exp.period}</div>
            <div className={styles.timelineContent}>
              <h3 className={styles.timelineTitle}>
                {exp.title}
                <span className={styles.timelineCompany}>{exp.company}</span>
              </h3>
              <ul className={styles.timelineDescription}>
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

