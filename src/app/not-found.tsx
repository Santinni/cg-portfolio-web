"use client";

import { Button } from './(frontend)/components/primitives/button';
import styles from './(frontend)/styles/error.module.css';

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page not found</h2>
        <p className={styles.message}>
          Sorry, but the page you are looking for does not exist.
        </p>
        <Button renders="link" href="/">
          Home page
        </Button>
      </div>
    </div>
  );
}
