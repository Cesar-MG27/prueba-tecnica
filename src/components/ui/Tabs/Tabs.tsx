import { cx } from '@/utils/cx';
import styles from './Tabs.module.css';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
}

/**
 * Pestanas con una linea corta bajo la etiqueta activa.
 * El subrayado vive en el <span> del texto, por eso mide justo lo que mide
 * la palabra y no toda la columna.
 */
export function Tabs<T extends string>({ tabs, activeId, onChange }: TabsProps<T>) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          className={cx(styles.tab, tab.id === activeId && styles.active)}
          onClick={() => onChange(tab.id)}
        >
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
