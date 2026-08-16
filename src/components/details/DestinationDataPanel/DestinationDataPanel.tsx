import { Accordion } from '@/components/ui/Accordion/Accordion';
import { InfoRow } from '@/components/ui/InfoRow/InfoRow';
import type { Destination } from '@/types/order';
import { formatLongDate, formatTime } from '@/utils/date';
import styles from './DestinationDataPanel.module.css';

interface DestinationDataPanelProps {
  destination: Destination;
  open: boolean;
  onToggle: () => void;
}

const TITLE = {
  pickup: 'Pickup Data',
  dropoff: 'Dropoff Data',
} as const;

/** Panel expandible con los datos del destino seleccionado. */
export function DestinationDataPanel({ destination, open, onToggle }: DestinationDataPanelProps) {
  const { kind, address, startDate, contact } = destination;


  return (
    <Accordion title={TITLE[kind]} open={open} onToggle={onToggle}>
      <div className={styles.content}>
        <p className={styles.address}>{address}</p>

        <p className={styles.datetime}>
          <span>{formatLongDate(startDate)}</span>
          <span className={styles.separator}>•</span>
          <span>{formatTime(startDate)}</span>
        </p>

        {contact.telephone ? (
          <InfoRow value={contact.telephone} href={`tel:${contact.telephone.replace(/\s/g, '')}`} />
        ) : null}

        {contact.email ? <InfoRow value={contact.email} href={`mailto:${contact.email}`} /> : null}
      </div>
    </Accordion>
  );
}
