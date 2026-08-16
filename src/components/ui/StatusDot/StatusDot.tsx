import type { DotVariant } from '@/types/order';
import { cx } from '@/utils/cx';
import styles from './StatusDot.module.css';

interface StatusDotProps {
  variant?: DotVariant;
  label?: string | null;
  /** Envuelve el punto y el texto en una pastilla con fondo. */
  chip?: boolean;
}

/** Punto de estado + texto opcional (mapea el `status_class` de la API). */
export function StatusDot({ variant = 'grey', label, chip = false }: StatusDotProps) {
  return (
    <span className={cx(styles.wrapper, chip && styles.chip)}>
      <span className={cx(styles.dot, styles[variant])} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </span>
  );
}
