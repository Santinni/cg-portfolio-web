import { Service } from '@/payload-types';

import styles from './Services.module.css';

interface ServicesProps {
  data: Service[];
}

export default function Services({ data }: ServicesProps) {
  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        <h2 className={styles.title}>How may I help you?</h2>
        <p className={styles.subtitle}>
          Together, we can turn your visions into reality.
        </p>
        <div className={styles.grid}>
          {data.map((service, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{service.icon}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
