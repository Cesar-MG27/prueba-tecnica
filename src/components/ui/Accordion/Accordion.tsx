import { useId } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import { cx } from '@/utils/cx';
import styles from './Accordion.module.css';

interface AccordionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Panel expandible. El contenido anima con `grid-template-rows: 0fr -> 1fr`,
 * asi la transicion funciona con cualquier altura sin fijar un max-height.
 */
export function Accordion({ title, open, onToggle, children, className }: AccordionProps) {
  const contentId = useId();

  return (
    <section className={cx(styles.accordion, className)}>
      <button
        type="button"
        className={styles.header}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
      >
        <span className={styles.title}>{title}</span>
        <Icon name="chevron-down" size={18} className={cx(styles.chevron, open && styles.open)} />
      </button>

      <div id={contentId} className={cx(styles.panel, open && styles.open)} aria-hidden={!open}>
        <div className={styles.panelInner}>
          <div className={styles.content} inert={open ? undefined : true}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
