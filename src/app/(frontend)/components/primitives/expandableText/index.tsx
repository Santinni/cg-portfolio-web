"use client";

import {
  FC,
  PropsWithChildren,
  useState,
} from 'react';

import { ChevronDownIcon } from 'lucide-react';

import { Button } from '../button';
import styles from './ExpandableText.module.css';

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
        <ChevronDownIcon className={styles.triggerIcon} />
      </Button>
    </div>
  );
};

export default ExpandableText;
