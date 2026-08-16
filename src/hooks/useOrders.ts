import { useCallback } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getUpcomingOrders } from '@/services/orders.service';
import type { Order } from '@/types/order';

export function useOrders() {
  const task = useCallback((signal: AbortSignal) => getUpcomingOrders(signal), []);
  const { data, loading, error, refetch } = useAsync<Order[]>(task, [task]);

  return { orders: data ?? [], loading, error, refetch };
}
