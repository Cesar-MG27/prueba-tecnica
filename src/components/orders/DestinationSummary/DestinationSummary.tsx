import { Icon } from '@/components/ui/Icon/Icon';
import type { Destination } from '@/types/order';
import { formatDate, formatTime } from '@/utils/date';
import styles from './DestinationSummary.module.css';

interface DestinationSummaryProps {
  destination: Destination;
  /** El ultimo destino no dibuja la linea conectora. */
  isLast?: boolean;
}

/** Etiqueta de interfaz; la API manda "Recoleccion" / "Entrega". */
const KIND_LABEL: Record<Destination['kind'], string> = {
  pickup: 'PICKUP',
  dropoff: 'DROPOFF',
};

/** Fila de origen/destino dentro de la tarjeta de orden. */
export function DestinationSummary({ destination, isLast = false }: DestinationSummaryProps) {
  const { kind, city, address, startDate } = destination;

  return (
    <div className={styles.row}>
      <span className={styles.marker}>
        <Icon name={kind === 'pickup' ? 'pin-pickup' : 'pin-dropoff'} size={22} />
        {!isLast ? <span className={styles.line} /> : null}
      </span>

      <div className={styles.info}>
        <span className={styles.kind}>{KIND_LABEL[kind]}</span>
        <span className={styles.city}>{city}</span>
        <span className={styles.address}>{address}</span>
      </div>

      <div className={styles.time}>
        <span className={styles.date}>{formatDate(startDate)}</span>
        <span className={styles.hour}>{formatTime(startDate)}</span>
      </div>
    </div>
  );
}
