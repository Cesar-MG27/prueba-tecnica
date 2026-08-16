import { Icon } from '@/components/ui/Icon/Icon';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  onBell?: () => void;
}

export function AppHeader({ title, onBack, onBell }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <button type="button" className={styles.action} onClick={onBack} aria-label="Go back">
        <Icon name="chevron-left" size={22} />
      </button>

      <h1 className={styles.title}>{title}</h1>

      <button
        type="button"
        className={styles.action}
        onClick={onBell}
        aria-label="Notifications"
        data-accent="true"
      >
        <Icon name="bell" size={22} />
      </button>
    </header>
  );
}
