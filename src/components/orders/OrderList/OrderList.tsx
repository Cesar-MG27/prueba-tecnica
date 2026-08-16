import { OrderCard } from "@/components/orders/OrderCard/OrderCard";
import type { Order } from "@/types/order";
import styles from "./OrderList.module.css";

interface OrderListProps {
  orders: Order[];
  onResume: (order: Order) => void;
  onPickup: (order: Order) => void;
}

export function OrderList({ orders, onResume, onPickup }: OrderListProps) {
  return (
    <ul className={styles.list}>
      {orders.map((order) => (
        <li key={order.id}>
          <OrderCard order={order} onResume={onResume} onPickup={onPickup} />
        </li>
      ))}
    </ul>
  );
}
