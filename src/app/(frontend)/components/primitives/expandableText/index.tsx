"use client";

import { ChevronDownIcon } from "lucide-react";
import styles from "./ExpandableText.module.css";
import { FC, PropsWithChildren, useState } from "react";
import { Button } from "../button";

const ExpandableText: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.expandableText}>
      <div
        className={`${styles.expandableTextBody} ${isOpen ? styles.open : ""}`}
      >
        {children}
      </div>
      <Button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        variant="transparent"
        rounded
      >
        <ChevronDownIcon className={styles.accordionIcon} />
      </Button>
    </div>
  );
};

export default ExpandableText;
