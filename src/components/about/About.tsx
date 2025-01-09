import Image from "next/image";
import styles from "./About.module.css";
import { AboutType } from "@/types/about";

export default function About({ data }: { data: AboutType }) {
  console.log(data);
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title}</h2>
        <div className={styles.content}>
          <div className={styles.text}>
            {data.content.root.children.map((node, index) => {
              if (node.type === "paragraph") {
                return (
                  <p key={index} className={styles.paragraph}>
                    {(node.children as Array<{ text: string }>).map(
                      (child, i) => (
                        <span key={i}>{child.text}</span>
                      )
                    )}
                  </p>
                );
              }
              //TODO check if this is the correct way to render the content from rich text
              // For other types, we currently return null,
              // support for additional types in the RichText component can be added later.
              // ideally we would have a component for each type of node maybe in a separate file
              return null;
            })}
          </div>
          {data.image && (
            <div className={styles.imageContainer}>
              <Image
                src={data.image.url}
                alt="About me"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
