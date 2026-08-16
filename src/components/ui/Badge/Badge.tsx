import { Icon } from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/Icon';
import styles from './Badge.module.css';

interface BadgeProps {
  /** Tipo de carga que manda la API ("FTL" / "FCL"). */
  type: string;
}

/** El icono del badge depende del tipo de carga. */
function iconForType(type: string): IconName {
  const key = type.toLowerCase();
  if (key === 'fcl') return 'fcl';
  if (key === 'ftl') return 'ftl';
  return 'truck';
}

export function Badge({ type }: BadgeProps) {
  return (
    <span className={styles.badge}>
      <Icon name={iconForType(type)} size={15} />
      {type}
    </span>
  );
}
