"use client";

import { useEffect } from 'react';

import { Button } from './(frontend)/components/primitives/button';
import styles from './(frontend)/styles/error.module.css';

type Props = {
  error: Error;
  reset(): void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Something went wrong!</h1>
        <p className={styles.message}>{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
