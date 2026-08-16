import { Icon } from '@/components/ui/Icon/Icon';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
}

function getInitials(name?: string | null): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/** Avatar con degradado a iniciales y, si no hay nombre, al icono placeholder. */
export function Avatar({ src, name, size = 72 }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <span className={styles.avatar} style={{ width: size, height: size }}>
      {src ? (
        <img className={styles.image} src={src} alt={name ?? ''} />
      ) : initials ? (
        <span className={styles.initials}>{initials}</span>
      ) : (
        <Icon name="user" size={Math.round(size / 2.5)} />
      )}
    </span>
  );
}
