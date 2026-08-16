import { CountdownButton } from "@/components/orders/CountdownButton/CountdownButton";
import { DestinationSummary } from "@/components/orders/DestinationSummary/DestinationSummary";
import { OrderCardHeader } from "@/components/orders/OrderCardHeader/OrderCardHeader";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Icon } from "@/components/ui/Icon/Icon";
import type { Order } from "@/types/order";
import styles from "./OrderCard.module.css";

interface OrderCardProps {
  order: Order;
  onResume: (order: Order) => void;
  onPickup: (order: Order) => void;
}

export function OrderCard({ order, onResume, onPickup }: OrderCardProps) {
  // El boton de pickup solo aparece cuando la recoleccion es el tramo al que
  // toca navegar (`show_navigation` del destino). En las ordenes que ya
  // recogieron, la API mueve esa marca al dropoff y la tarjeta queda solo con Resume.
  const showPickupButton = order.pickup?.showNavigation ?? false;

  return (
    <article className={styles.wrapper}>
      <h2 className={styles.orderNumber}>
        Order <span>#{order.orderNumber}</span>{" "}
      </h2>

      {/* Sin padding: el header y los destinos ponen el suyo y los botones
          del footer llegan al borde de la tarjeta. */}
      <Card padded={false} className={styles.card}>
        <OrderCardHeader
          type={order.type}
          statusString={order.statusString}
          statusVariant={order.statusVariant}
        />

        <div className={styles.destinations}>
          {order.destinations.map((destination, index) => (
            <DestinationSummary
              key={destination.kind}
              destination={destination}
              isLast={index === order.destinations.length - 1}
            />
          ))}
        </div>

        <div className={styles.footer}>
          {showPickupButton ? (
            <CountdownButton
              target={order.startDate}
              // target={Date.now() + 90 * 1000}
              onReady={() => onPickup(order)}
              className={styles.pickupButton}
            />
          ) : null}

          <Button
            variant="primary"
            size="sm"
            iconRight={<Icon name="eye" size={16} />}
            onClick={() => onResume(order)}
            className={styles.resumeButton}
          >
            Resume
          </Button>
        </div>
      </Card>
    </article>
  );
}
