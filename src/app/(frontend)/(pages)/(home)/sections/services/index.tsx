import styles from "./Services.module.css";

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        <h2 className={styles.title}>How may I help you?</h2>
        <p className={styles.subtitle}>
          Together, we can turn your visions into reality.
        </p>
        <div className={styles.grid}>
          {services.map((service, index) => (
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
