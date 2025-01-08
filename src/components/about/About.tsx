import Image from "next/image";
import styles from "./About.module.css";

interface AboutProps {
  data: {
    title: string;
    content: any; // This should match the structure of your rich text field
    image: {
      url: string;
    };
  };
}

export default function About({ data }: AboutProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title}</h2>
        <div className={styles.content}>
          <div className={styles.text}>
            {/* You might need to use a rich text renderer here depending on your setup */}
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>
          <div className={styles.imageContainer}>
            <Image
              src={data.image.url}
              alt="About me"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
