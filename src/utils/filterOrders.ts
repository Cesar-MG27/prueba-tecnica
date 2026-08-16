import type { Order } from '@/types/order';

/** Normaliza para comparar: sin mayusculas, sin "#" ni espacios. */
function normalizeTerm(value: string): string {
  return value.toLowerCase().replace(/[#\s]/g, '');
}

/** Filtra las ordenes por numero de orden. Una busqueda vacia devuelve todo. */
export function filterByOrderNumber(orders: Order[], query: string): Order[] {
  const term = normalizeTerm(query);
  if (!term) return orders;

  return orders.filter((order) => normalizeTerm(order.orderNumber).includes(term));
}
