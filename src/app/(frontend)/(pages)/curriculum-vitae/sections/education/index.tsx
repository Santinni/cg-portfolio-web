import styles from "./Education.module.css";

type EducationItem = {
  period: string;
  institution: string;
  degree: string;
};

const educationItems: EducationItem[] = [
  {
    period: "2002-2006",
    institution: "COPTH, Poděbradská 1/179",
    degree:
      "Electrical engineering, telecommunications and computer technologies",
  },
];

type CourseItem = {
  year: string;
  name: string;
  description?: string;
};

const courses: CourseItem[] = [
  {
    year: "2018",
    name: "VzhuruDolu.cz",
    description:
      "Optimalizace rychlosti načítání, CSS kód: organizace a údržba, SVG do hloubky, Principy JavaScriptu",
  },
  {
    year: "2018",
    name: "Learn2code.cz",
    description: "CSS preprocesory: Sass",
  },
  {
    year: "2016",
    name: "Webrebel - online kurz webdesignu",
  },
  {
    year: "2016-2018",
    name: "Free Code Camp",
    description:
      "Full Stack Web Development Certification, Computer Software Engineering",
  },
  {
    year: "2015",
    name: "Codecademy",
    description: "Basics of HTML & CSS - www.codecademy.com",
  },
  {
    year: "2015",
    name: "S - COMP Centre CZ s.r.o., Ohradní 1079/59",
    description: "Web Application Programmer, Graphic studio worker",
  },
];

export const Education = () => {
  return (
    <section className={styles.education}>
      <h2 className={styles.sectionTitle}>Education</h2>
      <div className={styles.educationList}>
        {educationItems.map((item, index) => (
          <div key={index} className={styles.educationItem}>
            <div className={styles.period}>{item.period}</div>
            <div className={styles.details}>
              <h3 className={styles.institution}>{item.institution}</h3>
              <p className={styles.degree}>{item.degree}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className={styles.coursesTitle}>Courses and Seminars</h3>
      <div className={styles.coursesList}>
        {courses.map((course, index) => (
          <div key={index} className={styles.courseItem}>
            <div className={styles.courseYear}>{course.year}</div>
            <div className={styles.courseDetails}>
              <h4 className={styles.courseName}>{course.name}</h4>
              {course.description && (
                <p className={styles.courseDescription}>{course.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
