import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/utils/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'ghost' | 'pill';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...rest}
    >
      {iconLeft}
      {children ? <span className={styles.label}>{children}</span> : null}
      {iconRight}
    </button>
  );
}
