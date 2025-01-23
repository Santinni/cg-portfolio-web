import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./Button.module.css";
import clsx from "clsx";
import { Loader } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary" | "transparent" | "text";
  accent?: "light" | "dark";
  rounded?: boolean;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  textWeight?: "normal" | "demi" | "bold";
  textSize?: "small" | "medium" | "large";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      accent,
      rounded,
      size,
      isLoading,
      disabled,
      textWeight,
      fullWidth,
      textSize,
      onClick,
      ...attrs
    },
    ref
  ) => {
    const ariaAttrs = {
      "aria-busy": isLoading ? true : undefined,
      "aria-disabled": disabled ? true : undefined,
      ...(attrs["aria-label"] ? { "aria-label": attrs["aria-label"] } : {}),
    };

    const classes = clsx(
      styles.button,
      {
        [styles[`variant-${variant}`]]: variant,
        [styles[`accent-${accent}`]]: accent,
        [styles[`size-${size}`]]: size,
        [styles.disabled]: disabled,
        [styles[`text-weight-${textWeight}`]]: textWeight,
        [styles.fullWidth]: fullWidth,
        [styles[`text-size-${textSize}`]]: textSize,
        [styles.rounded]: rounded,
        [styles.isLoading]: isLoading,
      },
      className
    );

    return (
      <button
        {...attrs}
        {...ariaAttrs}
        className={classes}
        onClick={onClick}
        ref={ref}
        disabled={disabled || isLoading}
      >
        {isLoading && (
          <span className={styles.loading}>
            <Loader className={styles.loadingIcon} />
          </span>
        )}
        <span
          className={clsx(isLoading && styles.isLoading, styles.buttonContent)}
        >
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
