import { Badge } from '@/components/ui/Badge/Badge';
import { StatusDot } from '@/components/ui/StatusDot/StatusDot';
import type { DotVariant } from '@/types/order';
import styles from './OrderCardHeader.module.css';

interface OrderCardHeaderProps {
  type: string;
  statusString: string;
  statusVariant: DotVariant;
}

export function OrderCardHeader({ type, statusString, statusVariant }: OrderCardHeaderProps) {
  return (
    <div className={styles.header}>
      <Badge type={type} />
      <StatusDot variant={statusVariant} label={statusString} />
    </div>
  );
}
