// import Link from "next/link";
import Link, { LinkProps } from "next/link";
import styles from "./LinkButton.module.css";

interface LinkButtonProps extends LinkProps {
  href: string;
  children: React.ReactNode;
}

export const LinkButton = ({ href, children }: LinkButtonProps) => {
  return (
    <Link href={href} className={styles.linkButton}>
      {children}
    </Link>
  );
};
