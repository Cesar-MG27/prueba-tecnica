import { useCallback } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getOrderDetail } from '@/services/orders.service';
import type { OrderDetail } from '@/types/order';

export function useOrderDetail(orderId: string) {
  const task = useCallback((signal: AbortSignal) => getOrderDetail(orderId, signal), [orderId]);
  const { data, loading, error, refetch } = useAsync<OrderDetail>(task, [task]);

  return { order: data, loading, error, refetch };
}
