import { useState } from "react";
import { Button } from "../../primitives/button";
import styles from "./BookingModal.module.css";
import clsx from "clsx";
import { X } from "lucide-react";
const BookingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bookingUrl =
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1C4Xr8kHc-vu8Mr9Yivuejsv52uG4U0TwcpvlKKx68ItOEY9ZN5yiWwbNHOUPMPGqaFHSL8Dbb?gv=true";

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Book an Appointment</Button>

      {isOpen && (
        <div
          className={clsx(styles.modalOverlay)}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={bookingUrl}
              style={{ border: 0 }}
              width="100%"
              height="100%"
              frameBorder="0"
            ></iframe>
          </div>
          <Button
            className={styles.modalClose}
            onClick={() => setIsOpen(false)}
            variant="transparent"
          >
            <X />
          </Button>
        </div>
      )}
    </>
  );
};

export default BookingModal;
