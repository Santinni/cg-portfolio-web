import { forwardRef, cloneElement, ReactElement } from "react";
import styles from "./ExpandingButton.module.css";
import Link from "next/link";

interface ExpandingButtonProps {
  href: string;
  download: boolean;
  buttonText: string;
  icon: ReactElement<{ className?: string }>;
  isFloating?: boolean;
}

export const ExpandingButton = forwardRef<
  HTMLAnchorElement,
  ExpandingButtonProps
>(({ href, download, buttonText, icon, isFloating }, ref) => {
  const expandingButtonContent = (
    <Link
      className={styles.expandingButton}
      href={href}
      download={download}
      ref={ref}
    >
      {cloneElement(icon, { className: styles.expandingButtonIcon })}
      <span className={styles.expandingButtonText}>{buttonText}</span>
    </Link>
  );

  return isFloating ? (
    <div className={styles.floatingButtonWrapper}>{expandingButtonContent}</div>
  ) : (
    expandingButtonContent
  );
});

ExpandingButton.displayName = "ExpandingButton";
