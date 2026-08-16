import { Avatar } from '@/components/ui/Avatar/Avatar';
import type { Driver } from '@/types/order';
import { formatTime12h } from '@/utils/date';
import styles from './DriverSummary.module.css';

interface DriverSummaryProps {
  driver: Driver;
  timestamp: number | null;
}

/** Foto del conductor sobrepuesta al borde superior de la tarjeta, y la hora. */
export function DriverSummary({ driver, timestamp }: DriverSummaryProps) {
  return (
    <div className={styles.wrapper}>
      <Avatar src={driver.thumbnail} name={driver.name} size={76} />
      <p className={styles.time}>{formatTime12h(timestamp)}</p>
    </div>
  );
}
