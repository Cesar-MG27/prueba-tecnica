/**
 * Tipos de la API y del modelo normalizado que consume la UI.
 *
 * La API devuelve los destinos con dos formas distintas segun el endpoint:
 * - /orders/upcoming: `start_date` / `end_date` + `nickname`
 * - /orders:          `startDate` / `endDate` + `contact_info` + `place_id_pickup|dropoff`
 * Esa diferencia se resuelve una sola vez en `utils/normalize.ts`.
 */

/* ------------------------------------------------------------------ */
/* Respuesta cruda de la API                                           */
/* ------------------------------------------------------------------ */

export interface ApiResponse<T> {
  status: number;
  result: T;
}

export interface RawContactInfo {
  name?: string;
  telephone?: string;
  email?: string;
  country_code?: string;
  rfc?: string;
}

export interface RawDestination {
  address: string;
  /** Presente en el listado. */
  start_date?: number;
  end_date?: number;
  /** Presente en el detalle. */
  startDate?: number;
  endDate?: number;
  /** "Recoleccion" | "Entrega" — solo en el listado. */
  nickname?: string;
  show_navigation?: boolean;
  /** Solo en el detalle. */
  place_id_pickup?: string;
  place_id_dropoff?: string;
  contact_info?: RawContactInfo;
  status?: number;
  status_string?: string;
  status_class?: string;
  lat?: number;
  lng?: number;
}

export interface RawOrder {
  _id: string;
  status: number;
  order_number: string;
  type: string;
  destinations: RawDestination[];
  start_date: number;
  end_date: number;
  is_today?: boolean;
  status_string?: string;
  status_class?: string;
  driver_thumbnail?: string | null;
}

export interface RawStatusListItem {
  active: boolean;
  status: string;
}

export interface RawUser {
  nickname?: string;
  email?: string;
  telephone?: string;
  thumbnail?: string;
}

export interface RawOrderDetail {
  _id: string;
  reference_number?: string;
  order_number: string;
  status: number;
  start_date: number;
  end_date: number;
  driver?: RawUser;
  manager?: RawUser;
  destinations: RawDestination[];
  status_list: {
    pickup: RawStatusListItem[];
    dropoff: RawStatusListItem[];
  };
}

/* ------------------------------------------------------------------ */
/* Modelo normalizado que consumen los componentes                     */
/* ------------------------------------------------------------------ */

export type DestinationKind = 'pickup' | 'dropoff';

export type DotVariant = 'grey' | 'blue' | 'green' | 'yellow';

export interface Contact {
  name: string | null;
  telephone: string | null;
  email: string | null;
}

export interface Destination {
  kind: DestinationKind;
  address: string;
  city: string;
  startDate: number | null;
  endDate: number | null;
  contact: Contact;
  /** Etiqueta del tramo tal cual la manda la API ("Recoleccion" / "Entrega"). */
  nickname: string | null;
  statusString: string | null;
  statusVariant: DotVariant;
  /** La API marca con esto el tramo al que toca navegar ahora. */
  showNavigation: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: string;
  status: number;
  statusString: string;
  statusVariant: DotVariant;
  startDate: number;
  endDate: number;
  destinations: Destination[];
  pickup: Destination | null;
  dropoff: Destination | null;
}

export interface StatusStepItem {
  label: string;
  active: boolean;
}

export interface Driver {
  name: string | null;
  thumbnail: string | null;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  referenceNumber: string | null;
  status: number;
  startDate: number;
  endDate: number;
  driver: Driver;
  destinations: Destination[];
  pickup: Destination | null;
  dropoff: Destination | null;
  statusList: Record<DestinationKind, StatusStepItem[]>;
}
