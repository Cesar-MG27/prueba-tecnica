import { request } from '@/services/http';
import type { Order, OrderDetail, RawOrder, RawOrderDetail } from '@/types/order';
import { normalizeOrder, normalizeOrderDetail } from '@/utils/normalize';

export async function getUpcomingOrders(signal?: AbortSignal): Promise<Order[]> {
  const raw = await request<RawOrder[]>('/orders/upcoming', signal);
  return raw.map(normalizeOrder);
}

/**
 * El mock de Postman expone `/orders` sin parametro y siempre devuelve la misma orden.
 * El `orderId` se conserva en la firma para que migrar a `/orders/${orderId}`
 * sea un cambio de una linea cuando exista el endpoint real.
 */
export async function getOrderDetail(_orderId: string, signal?: AbortSignal): Promise<OrderDetail> {
  const raw = await request<RawOrderDetail>('/orders', signal);
  return normalizeOrderDetail(raw);
}
