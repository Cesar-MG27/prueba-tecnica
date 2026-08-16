import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DestinationDataPanel } from '@/components/details/DestinationDataPanel/DestinationDataPanel';
import { DriverSummary } from '@/components/details/DriverSummary/DriverSummary';
import { OrderSummaryCard } from '@/components/details/OrderSummaryCard/OrderSummaryCard';
import { StatusStepper } from '@/components/details/StatusStepper/StatusStepper';
import { AppHeader } from '@/components/ui/AppHeader/AppHeader';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useOrderDetail } from '@/hooks/useOrderDetail';
import type { DestinationKind, Order } from '@/types/order';
import { mergeOrderDetail } from '@/utils/normalize';
import { syncStepsWithStatus, TRACKABLE_STATUS } from '@/utils/status';
import styles from './CargoDetailsScreen.module.css';

interface DetailsLocationState {
  order?: Order;
}

export function CargoDetailsScreen() {
  const navigate = useNavigate();
  const { orderId = '' } = useParams();
  const { state } = useLocation() as { state: DetailsLocationState | null };

  const { order: payload, loading, error, refetch } = useOrderDetail(orderId);
  const [selectedKind, setSelectedKind] = useState<DestinationKind>('pickup');
  const dataPanel = useDisclosure(true);

  if (loading) {
    return (
      <div className={styles.screen}>
        <AppHeader title="Cargo Details" onBack={() => navigate(-1)} />
        <Spinner />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className={styles.screen}>
        <AppHeader title="Cargo Details" onBack={() => navigate(-1)} />
        <ErrorState message={error?.message} onRetry={refetch} />
      </div>
    );
  }

  // Reconcilia el payload generico del mock con la orden que se abrio.
  const order = mergeOrderDetail(state?.order ?? null, payload);

  // Requisito 1: el destino seleccionado alimenta el stepper y el panel de datos.
  const selectedDestination =
    order.destinations.find((destination) => destination.kind === selectedKind) ??
    order.destinations[0];

  // Requisito 3: el boton solo se activa del status 3 en adelante.
  const canTrack = order.status >= TRACKABLE_STATUS;

  // El `active` que trae `status_list` corresponde siempre a la misma orden del
  // mock, asi que el avance se recalcula contra el status real de esta orden.
  const steps = syncStepsWithStatus(
    order.statusList[selectedKind],
    order.status,
    selectedKind === 'pickup' ? 0 : order.statusList.pickup.length,
  );

  const handleTrackOrder = () => {
    console.log('Track Order');
  };

  return (
    <div className={styles.screen}>
      <AppHeader title="Cargo Details" onBack={() => navigate(-1)} />

      <main className={styles.content}>
        <OrderSummaryCard
          referenceNumber={order.referenceNumber}
          orderNumber={order.orderNumber}
          destinations={order.destinations}
          selectedKind={selectedKind}
          onSelect={setSelectedKind}
          orderStatus={order.status}
        />

        {/* El avatar sobresale por arriba y el boton se pega al fondo de la tarjeta. */}
        <Card padded={false} className={styles.statusCard}>
          <DriverSummary driver={order.driver} timestamp={selectedDestination?.startDate ?? null} />

          {/* Requisito 2: los checks reflejan los estados del destino elegido. */}
          <div className={styles.stepper}>
            <StatusStepper steps={steps} />
          </div>

          <Button
            variant="primary"
            fullWidth
            disabled={!canTrack}
            onClick={handleTrackOrder}
            className={styles.trackButton}
          >
            Track Order
          </Button>
        </Card>

        {/* Requisito 4: panel expandible con el resto de la informacion. */}
        {selectedDestination ? (
          <DestinationDataPanel
            destination={selectedDestination}
            open={dataPanel.isOpen}
            onToggle={dataPanel.toggle}
          />
        ) : null}
      </main>
    </div>
  );
}
