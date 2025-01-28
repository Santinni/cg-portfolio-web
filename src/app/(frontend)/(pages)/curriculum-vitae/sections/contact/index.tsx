import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import styles from "./Cont.module.css";

export const Contact = () => {
  return (
    <div className={styles.contact}>
      <div className={styles.contactItem}>
        <Phone className={styles.icon} />
        <Link href="tel:+420605570494">+420 605 570 494</Link>
      </div>
      <div className={styles.contactItem}>
        <Mail className={styles.icon} />
        <Link href="mailto:karel.kutchan@email.cz">karel.kutchan@email.cz</Link>
      </div>
      <div className={styles.contactItem}>
        <Linkedin className={styles.icon} />
        <Link
          href="https://www.linkedin.com/in/karelkutchan/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </Link>
      </div>
      <div className={styles.contactItem}>
        <MapPin className={styles.icon} />
        <span>Prague, Czech Republic</span>
      </div>
    </div>
  );
};
