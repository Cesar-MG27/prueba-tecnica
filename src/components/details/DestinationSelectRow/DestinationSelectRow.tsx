import { Icon } from '@/components/ui/Icon/Icon';
import { StatusDot } from '@/components/ui/StatusDot/StatusDot';
import type { Destination, DotVariant } from '@/types/order';
import { cx } from '@/utils/cx';
import styles from './DestinationSelectRow.module.css';

interface DestinationSelectRowProps {
  destination: Destination;
  selected: boolean;
  onSelect: () => void;
  /** Estado del tramo, derivado del status de la orden. */
  statusLabel: string;
  statusVariant: DotVariant;
  /** El ultimo destino no dibuja la linea conectora. */
  isLast?: boolean;
}

/** Etiqueta de interfaz; la API manda "Recoleccion" / "Entrega". */
const KIND_LABEL: Record<Destination['kind'], string> = {
  pickup: 'PICKUP',
  dropoff: 'DROPOFF',
};

/**
 * Fila seleccionable del resumen. El circulo del icono es el indicador:
 * amarillo relleno en el destino activo, aro oscuro en el otro.
 */
export function DestinationSelectRow({
  destination,
  selected,
  onSelect,
  statusLabel,
  statusVariant,
  isLast = false,
}: DestinationSelectRowProps) {
  const { kind, city, address } = destination;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={styles.row}
      onClick={onSelect}
    >
      <span className={styles.marker}>
        <span className={cx(styles.bullet, selected && styles.selected)}>
          <Icon name={kind === 'pickup' ? 'pin-pickup' : 'pin-dropoff'} size={18} />
        </span>
        {!isLast ? <span className={styles.line} /> : null}
      </span>

      <span className={styles.info}>
        <span className={styles.kind}>{KIND_LABEL[kind]}</span>
        <span className={cx(styles.city, selected && styles.cityActive)}>{city}</span>
        <span className={styles.address}>{address}</span>
        <StatusDot variant={statusVariant} label={statusLabel} chip />
      </span>
    </button>
  );
}
