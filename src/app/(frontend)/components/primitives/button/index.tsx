import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  MouseEventHandler,
  ReactNode,
  Ref,
} from "react";

import clsx from "clsx";
import { Loader } from "lucide-react";
import Link, { LinkProps } from "next/link";

import styles from "./Button.module.css";

interface BaseButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "transparent" | "text";
  accent?: "light" | "dark";
  rounded?: boolean;
  size?: "small" | "medium" | "large";
  textWeight?: "normal" | "demi" | "bold";
  textSize?: "small" | "medium" | "large";
  fullWidth?: boolean;
  children?: ReactNode;
}

interface AsButtonProps
  extends BaseButtonProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  renders?: "button";
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface AsLinkProps
  extends BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    LinkProps {
  renders: "link";
  isLoading?: never;
  isDisabled?: never;
  onClick?: never;
}

export type ButtonOrLinkProps = AsButtonProps | AsLinkProps;

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonOrLinkProps
>(
  (
    {
      className,
      children,
      variant,
      accent,
      rounded,
      size,
      textWeight,
      fullWidth,
      textSize,
      onClick,
      isLoading,
      isDisabled,
      ...rest
    },
    ref
  ) => {
    const ariaAttrs = {
      "aria-busy": isLoading ? true : undefined,
      "aria-disabled": isDisabled ? true : undefined,
      ...(rest["aria-label"] ? { "aria-label": rest["aria-label"] } : {}),
    };

    const classes = clsx(
      styles.button,
      {
        [styles[`variant-${variant}`]]: variant,
        [styles[`accent-${accent}`]]: accent,
        [styles[`size-${size}`]]: size,
        [styles.disabled]: isDisabled,
        [styles[`text-weight-${textWeight}`]]: textWeight,
        [styles.fullWidth]: fullWidth,
        [styles[`text-size-${textSize}`]]: textSize,
        [styles.rounded]: rounded,
        [styles.isLoading]: isLoading,
      },
      className
    );

    if (rest.renders === "link") {
      const { href, ...linkRest } = rest as AsLinkProps;

      return (
        <Link
          href={href}
          ref={ref as Ref<HTMLAnchorElement>}
          className={classes}
          {...linkRest}
        >
          <span className={styles.buttonContent}>{children}</span>
        </Link>
      );
    } else {
      const buttonProps = rest as AsButtonProps;

      return (
        <button
          className={classes}
          onClick={onClick}
          disabled={isDisabled || isLoading}
          ref={ref as React.Ref<HTMLButtonElement>}
          {...buttonProps}
          {...ariaAttrs}
        >
          {isLoading && (
            <span className={styles.loading}>
              <Loader className={styles.loadingIcon} />
            </span>
          )}
          <span
            className={clsx(
              isLoading && styles.isLoading,
              styles.buttonContent
            )}
          >
            {children}
          </span>
        </button>
      );
    }
  }
);

Button.displayName = "Button";
