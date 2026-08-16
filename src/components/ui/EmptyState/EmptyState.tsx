import { Icon } from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/Icon';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: IconName;
}

export function EmptyState({ title, message, icon = 'inbox' }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <Icon name={icon} size={28} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      {message ? <p className={styles.message}>{message}</p> : null}
    </div>
  );
}
