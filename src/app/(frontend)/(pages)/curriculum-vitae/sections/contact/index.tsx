import {
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

import styles from './Contact.module.css';

export const Contact = () => {
  return (
    <div className={styles.contact}>
      <div className={styles.contactItem}>
        <Link href="tel:+420605570494" className={styles.contactLink}>
          <Phone className={styles.icon} />
          +420 605 570 494
        </Link>
      </div>
      <div className={styles.contactItem}>
        <Link
          href="mailto:karel.kutchan@email.cz"
          className={styles.contactLink}
        >
          <Mail className={styles.icon} />
          karel.kutchan@email.cz
        </Link>
      </div>
      <div className={styles.contactItem}>
        <Link
          href="https://www.linkedin.com/in/karelkutchan/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          <Linkedin className={styles.icon} />
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
