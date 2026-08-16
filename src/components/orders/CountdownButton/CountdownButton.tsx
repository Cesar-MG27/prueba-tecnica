import { useCountdown } from '@/hooks/useCountdown';
import { cx } from '@/utils/cx';
import styles from './CountdownButton.module.css';

interface CountdownButtonProps {
  /** Fecha objetivo en epoch ms (el `start_date` de la orden). */
  target: number | null;
  onReady: () => void;
  waitingLabel?: string;
  readyLabel?: string;
  className?: string;
}

/**
 * Muestra la cuenta regresiva hacia `target` y se habilita al vencer.
 *
 * Es el unico componente que se repinta cada segundo: el hook vive aqui para
 * que la tarjeta y la lista no vuelvan a renderizarse con cada tick.
 * Ambos estados comparten el mismo <button> para que el cambio de color
 * transicione en lugar de reemplazar el nodo.
 */
export function CountdownButton({
  target,
  onReady,
  waitingLabel = 'Start pickup in',
  readyLabel = 'Its time for pickup',
  className,
}: CountdownButtonProps) {
  const { formatted, isElapsed } = useCountdown(target);

  return (
    <button
      type="button"
      className={cx(styles.button, isElapsed ? styles.ready : styles.waiting, className)}
      disabled={!isElapsed}
      onClick={onReady}
    >
      {isElapsed ? (
        readyLabel
      ) : (
        <>
          {waitingLabel} <span className={styles.time}>{formatted}</span>
        </>
      )}
    </button>
  );
}
