import type {
  Destination,
  DestinationKind,
  Order,
  OrderDetail,
  RawDestination,
  RawOrder,
  RawOrderDetail,
  StatusStepItem,
} from '@/types/order';
import { getCityFromAddress } from '@/utils/address';
import { dotVariant, orderStatusLabel, stepLabel } from '@/utils/status';

/**
 * Unico punto donde se resuelven las diferencias entre los dos endpoints.
 * A partir de aqui ningun componente ve `start_date` ni `place_id_pickup`.
 */

function resolveKind(raw: RawDestination, index: number): DestinationKind {
  if (raw.nickname) {
    return raw.nickname.toLowerCase().startsWith('recolec') ? 'pickup' : 'dropoff';
  }
  if (raw.place_id_pickup) return 'pickup';
  if (raw.place_id_dropoff) return 'dropoff';
  return index === 0 ? 'pickup' : 'dropoff';
}

export function normalizeDestination(raw: RawDestination, index: number): Destination {
  return {
    kind: resolveKind(raw, index),
    address: raw.address ?? '',
    city: getCityFromAddress(raw.address),
    startDate: raw.start_date ?? raw.startDate ?? null,
    endDate: raw.end_date ?? raw.endDate ?? null,
    contact: {
      name: raw.contact_info?.name ?? null,
      telephone: raw.contact_info?.telephone?.trim() ?? null,
      email: raw.contact_info?.email ?? null,
    },
    // `nickname` solo viene en el listado; en el detalle se cae al tipo de tramo.
    nickname: raw.nickname ?? null,
    statusString: raw.status_string ?? null,
    statusVariant: dotVariant(raw.status_class),
    showNavigation: raw.show_navigation ?? false,
  };
}

function pickByKind(destinations: Destination[], kind: DestinationKind): Destination | null {
  return destinations.find((destination) => destination.kind === kind) ?? null;
}

export function normalizeOrder(raw: RawOrder): Order {
  const destinations = (raw.destinations ?? []).map(normalizeDestination);

  return {
    id: raw._id,
    orderNumber: raw.order_number,
    type: raw.type,
    status: raw.status,
    statusString: orderStatusLabel(raw.status, raw.status_string ?? ''),
    statusVariant: dotVariant(raw.status_class),
    startDate: raw.start_date,
    endDate: raw.end_date,
    destinations,
    pickup: pickByKind(destinations, 'pickup'),
    dropoff: pickByKind(destinations, 'dropoff'),
  };
}

/**
 * El endpoint define cuantos pasos tiene cada tramo y en que orden; la etiqueta
 * se resuelve por su posicion en la escalera. `offset` es el indice global del
 * primer paso del tramo.
 */
function normalizeStatusList(
  items: { active: boolean; status: string }[] = [],
  offset = 0,
): StatusStepItem[] {
  return items.map((item, index) => ({
    label: stepLabel(offset + index, item.status),
    active: item.active,
  }));
}

/**
 * El mock de `/orders` ignora el id y siempre responde la misma orden, asi que
 * el detalle mostraria la referencia, direcciones y fechas de ID7PJQBJ en
 * cualquier orden. Cuando el `_id` recibido no coincide con el solicitado, se
 * conservan del listado los campos que si son de esta orden y del payload solo
 * lo que el listado no trae: `reference_number`, `contact_info` y `status_list`.
 */
export function mergeOrderDetail(listOrder: Order | null, detail: OrderDetail): OrderDetail {
  if (!listOrder || listOrder.id === detail.id) return detail;

  // Del payload solo se injerta el contacto: es lo unico que el listado no trae
  // y que la interfaz muestra. El estado del tramo se deriva del status.
  const destinations = listOrder.destinations.map((destination) => {
    const desdeDetalle = detail.destinations.find((d) => d.kind === destination.kind);
    return { ...destination, contact: desdeDetalle?.contact ?? destination.contact };
  });

  return {
    ...detail,
    id: listOrder.id,
    orderNumber: listOrder.orderNumber,
    status: listOrder.status,
    startDate: listOrder.startDate,
    endDate: listOrder.endDate,
    destinations,
    pickup: pickByKind(destinations, 'pickup'),
    dropoff: pickByKind(destinations, 'dropoff'),
  };
}

export function normalizeOrderDetail(raw: RawOrderDetail): OrderDetail {
  const destinations = (raw.destinations ?? []).map(normalizeDestination);

  return {
    id: raw._id,
    orderNumber: raw.order_number,
    referenceNumber: raw.reference_number ?? null,
    status: raw.status,
    startDate: raw.start_date,
    endDate: raw.end_date,
    driver: {
      name: raw.driver?.nickname ?? null,
      thumbnail: raw.driver?.thumbnail || null,
    },
    destinations,
    pickup: pickByKind(destinations, 'pickup'),
    dropoff: pickByKind(destinations, 'dropoff'),
    statusList: {
      pickup: normalizeStatusList(raw.status_list?.pickup),
      dropoff: normalizeStatusList(raw.status_list?.dropoff, raw.status_list?.pickup?.length ?? 0),
    },
  };
}
