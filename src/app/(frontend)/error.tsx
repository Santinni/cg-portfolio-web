"use client";

import { useEffect } from "react";

import { Button } from "@/app/(frontend)/components/primitives/button";
import styles from "@/app/(frontend)/styles/error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Something went wrong!</h1>
        <p className={styles.message}>
          {error.message || "An unexpected error occurred."}
        </p>
        <div className={styles.actions}>
          <Button onClick={reset}>Try again</Button>
          <Button renders="link" href="/">
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
