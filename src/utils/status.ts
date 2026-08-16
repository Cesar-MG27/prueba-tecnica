import type { DestinationKind, DotVariant, StatusStepItem } from '@/types/order';

/** El status minimo a partir del cual la orden se puede rastrear (viene del requisito). */
export const TRACKABLE_STATUS = 3;

const DOT_VARIANTS: Record<string, DotVariant> = {
  'grey-dot-bg': 'grey',
  'blue-dot-bg': 'blue',
  'green-dot-bg': 'green',
  'yellow-dot-bg': 'yellow',
};

/** Mapea el `status_class` de la API a la variante visual del punto. */
export function dotVariant(statusClass?: string | null): DotVariant {
  if (!statusClass) return 'grey';
  return DOT_VARIANTS[statusClass] ?? 'grey';
}

/**
 * VOCABULARIO DE INTERFAZ — decision de producto, no dato del endpoint.
 *
 * La API manda los estados en espanol ("Orden Asignada", "Recoleccion
 * completada", "En espera") y el diseno los pide en ingles con otras palabras.
 * No es traduccion literal: "Recoleccion completada" se muestra como
 * "In transit". Se resuelve por el indice numerico de `status`, no por el texto.
 *
 * El `status` de la orden es el indice del ultimo paso cumplido dentro de la
 * escalera que la propia API describe en `status_list` (4 de pickup + 3 de
 * dropoff). Verificado con ID7PJQBJ: status 1 y `active` en [true, true,
 * false, false].
 *
 *   0 Orden creada · 1 Orden asignada · 2 Recoleccion iniciada
 *   3 Recoleccion completada · 4 Entrega iniciada · 5 Entrega completada
 *   6 Orden completada
 */

/** Pasos del stepper del detalle. */
const STEP_LABELS = [
  'Created Order',
  'Accepted Order',
  'Pickup set up',
  'Pickup Completed',
  'Delivery Started',
  'Delivery Completed',
  'Order Completed',
];

/** Chip de la tarjeta: describe en que va la orden, no que paso se cumplio. */
const ORDER_LABELS = [
  'Created',
  'Assigned',
  'Picking up',
  'In transit',
  'Delivering',
  'Delivered',
  'Completed',
];

/** Etiqueta de un paso por su posicion en la escalera. */
export function stepLabel(index: number, fallback: string): string {
  return STEP_LABELS[index] ?? fallback;
}

/** Etiqueta del estado actual de la orden. */
export function orderStatusLabel(status: number, fallback: string): string {
  return ORDER_LABELS[status] ?? fallback;
}

/**
 * Recalcula que pasos estan cumplidos a partir del status de la orden.
 * Hace falta porque el mock de `/orders` responde siempre con la misma orden:
 * su `status_list` trae el avance de ID7PJQBJ y dejaria el dropoff sin marcar
 * en todas las demas.
 */
export function syncStepsWithStatus(
  steps: StatusStepItem[],
  orderStatus: number,
  offset: number,
): StatusStepItem[] {
  return steps.map((step, index) => ({
    ...step,
    active: orderStatus >= offset + index,
  }));
}

/**
 * Indices en los que cada tramo queda aceptado y completado.
 * El pickup se marca aceptado en cuanto la orden se asigna (1), que es como lo
 * muestra el diseno: orden asignada -> pickup "Accepted", dropoff "On hold".
 */
const LEG_RANGE: Record<DestinationKind, [number, number]> = {
  pickup: [1, 3],
  dropoff: [4, 5],
};

export interface DestinationProgress {
  label: string;
  variant: DotVariant;
}

/**
 * Estado del tramo derivado del status de la orden.
 *
 * No se usa `destinations[].status_string` porque en el payload del mock viene
 * siempre "En espera" con `status: 0`, incluso en ordenes cuya recoleccion ya
 * termino: contradiria al estado de la propia orden.
 */
export function destinationProgress(
  kind: DestinationKind,
  orderStatus: number,
): DestinationProgress {
  const [acceptedAt, completedAt] = LEG_RANGE[kind];

  if (orderStatus >= completedAt) return { label: 'Completed', variant: 'green' };
  if (orderStatus >= acceptedAt) return { label: 'Accepted', variant: 'blue' };
  return { label: 'On hold', variant: 'grey' };
}
