import { Button } from '@/components/ui/Button/Button';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "We couldn't load this information",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <Icon name="alert" size={28} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      {message ? <p className={styles.message}>{message}</p> : null}
      {onRetry ? (
        <Button variant="primary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
