import { Mail, Phone, MapPin } from "lucide-react"
import styles from "./contact.module.css"

export const Contact = () => {
  return (
    <div className={styles.contact}>
      <div className={styles.contactItem}>
        <Phone className={styles.icon} />
        <a href="tel:+420605570494">+420 605 570 494</a>
      </div>
      <div className={styles.contactItem}>
        <Mail className={styles.icon} />
        <a href="mailto:karel.kutchan@email.cz">karel.kutchan@email.cz</a>
      </div>
      <div className={styles.contactItem}>
        <MapPin className={styles.icon} />
        <span>Svitákova 2790/3, Praha 5</span>
      </div>
    </div>
  )
}

