import styles from './Experience.module.css';

type ExperienceItem = {
  period: string;
  title: string;
  company: string;
  description: string[];
};

const experiences: ExperienceItem[] = [
  {
    period: "6/2024 – Present",
    title: "Frontend Engineer",
    company: "Freelancer at Kontent.ai",
    description: [
      "I worked as part of a team on a contract-based project focused on improving accessibility and refactoring code to provide users with a better and more accessible user experience.",
      "Our team utilized React Aria, specifically its hooks, and developed custom solutions to address specific accessibility requirements.",
      "My responsibilities included ensuring the application complied with all accessibility standards, collaborating with team members to optimize code, and applying best practices for frontend development.",
      "We created an intuitive and efficient user interface while meeting strict accessibility guidelines within the project’s defined timeframe.",
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
    title: "Frontend Developer",
    company: "eMan a.s.",
    description: [
      "Developed and implemented user interfaces for key clients such as EON, MND, ČEZ, and Bohemia Energy.",
      "Optimized web applications to improve their performance and accessibility, resulting in higher user satisfaction.",
      "Refactored and modernized legacy code using React, NextJS, and TypeScript.",
      "Collaborated closely with UX designers and backend developers to meet client expectations.",
    ],
  },
  {
    period: "9/2020 – 9/2021",
    title: "Frontend Developer",
    company: "LMC",
    description: [
      "Focused on creating bespoke web solutions for corporate clients, delivering tailored solutions for platforms like jobs.cz.",
      "Collaborated with designers and clients to analyze requirements and design functional, visually appealing solutions.",
      "Used modern frontend technologies such as HTML, CSS, JavaScript, and React, ensuring responsive design and high performance.",
      "Prioritized accessibility standards and optimized user experience across devices and browsers.",
    ],
  },
  {
    period: "9/2019 – 9/2020",
    title: "Frontend Developer",
    company: "Amp X",
    description: [
      "Worked on the frontend of a new digital energy platform enabling distributed energy participation.",
      "Delivered high-quality, accessible, and responsive UI while maintaining clean and readable code.",
      "Used technologies such as ReactJS, Material-UI, Vanilla JavaScript, HTML5, and CSS-in-JS (JSS) to develop and implement frontend solutions.",
    ],
  },
  {
    period: "4/2019 – 9/2019",
    title: "Frontend Developer",
    company: "Skype.com",
    description: [
      "Contributed to a platform serving over 400,000 daily users from more than 30 countries.",
      "Focused on ensuring accessibility, responsiveness, and performance of the main website.",
      "Developed and optimized components, improved usability, and maintained clean, maintainable code.",
      "Worked closely with Kentico CMS to manage and integrate content.",
    ],
  },
  {
    period: "6/2018 – 3/2019",
    title: "Frontend Coder",
    company: "Foxconn DRC s.r.o.",
    description: [
      "Developed the GUI with a strong focus on HTML architecture and responsive design.",
      "Collaborated with designers and developers to implement modern CSS and JavaScript solutions.",
      "Worked with React, Vanilla JS, and occasionally jQuery.",
      "Developed a custom design system based on the BEM framework.",
    ],
  },
  {
    period: "5/2017 – 5/2018",
    title: "Frontend Coder",
    company: "Mountfield, a.s.",
    description: [
      "Managed and maintained the company's main website built on the Kentico platform.",
      "Created microsites and supported marketing websites, and developed responsive HTML newsletters.",
      "Contributed to internal application development to improve employee workflows and customer access.",
    ],
  },
  {
    period: "08/2014 – 5/2017",
    title: "Web Administrator, Graphic Designer, and Junior Frontend Coder",
    company: "BitWare CZ s.r.o.",
    description: [
      "Managed website administration, graphic design, and frontend development.",
      "Created responsive web presentations using HTML5/CSS3.",
      "Worked on WordPress-based projects, designed templates, and produced print materials.",
    ],
  },
];

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
  );
};
