import { Icon } from '@/components/ui/Icon/Icon';
import { cx } from '@/utils/cx';
import styles from './StatusStep.module.css';

interface StatusStepProps {
  label: string;
  active: boolean;
  isLast: boolean;
}

/** Paso del stepper: check amarillo si esta activo, punto gris si esta pendiente. */
export function StatusStep({ label, active, isLast }: StatusStepProps) {
  return (
    <li className={styles.step}>
      <span className={styles.marker}>
        <span className={cx(styles.circle, active && styles.active)}>
          <Icon name="check" size={10} className={styles.check} />
          <span className={styles.dot} />
        </span>
        {!isLast ? <span className={cx(styles.line, active && styles.activeLine)} /> : null}
      </span>

      <span className={cx(styles.label, active && styles.activeLabel)}>{label}</span>
    </li>
  );
}
