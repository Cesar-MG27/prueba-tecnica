import { DestinationSelectRow } from '@/components/details/DestinationSelectRow/DestinationSelectRow';
import { Card } from '@/components/ui/Card/Card';
import type { Destination, DestinationKind } from '@/types/order';
import { destinationProgress } from '@/utils/status';
import styles from './OrderSummaryCard.module.css';

interface OrderSummaryCardProps {
  referenceNumber: string | null;
  orderNumber: string;
  destinations: Destination[];
  selectedKind: DestinationKind;
  onSelect: (kind: DestinationKind) => void;
  /** Status real de la orden; define el estado que muestra cada tramo. */
  orderStatus: number;
}

export function OrderSummaryCard({
  referenceNumber,
  orderNumber,
  destinations,
  selectedKind,
  onSelect,
  orderStatus,
}: OrderSummaryCardProps) {
  return (
    <Card className={styles.card}>
      {referenceNumber ? <p className={styles.reference}>Reference {referenceNumber}</p> : null}
      <h2 className={styles.orderNumber}>Order #{orderNumber}</h2>

      <div className={styles.destinations} role="radiogroup" aria-label="Pickup and dropoff">
        {destinations.map((destination, index) => {
          const progress = destinationProgress(destination.kind, orderStatus);

          return (
            <DestinationSelectRow
              key={destination.kind}
              destination={destination}
              selected={destination.kind === selectedKind}
              onSelect={() => onSelect(destination.kind)}
              statusLabel={progress.label}
              statusVariant={progress.variant}
              isLast={index === destinations.length - 1}
            />
          );
        })}
      </div>
    </Card>
  );
}
