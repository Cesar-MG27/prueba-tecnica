import type { ElementType, ReactNode } from 'react';
import { cx } from '@/utils/cx';
import styles from './Card.module.css';

interface CardProps {
  as?: ElementType;
  padded?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({ as: Tag = 'div', padded = true, className, children }: CardProps) {
  return <Tag className={cx(styles.card, padded && styles.padded, className)}>{children}</Tag>;
}
