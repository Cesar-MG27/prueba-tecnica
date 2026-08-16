import { Icon } from '@/components/ui/Icon/Icon';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = '',
  label = 'Search by order number',
}: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <Icon name="search" size={18} className={styles.leading} />

      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  );
}
