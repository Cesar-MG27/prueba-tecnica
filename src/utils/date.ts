/** Todas las fechas de la API son epoch en milisegundos. */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

/**
 * Toda la interfaz va en ingles. Se usa `en-GB` y no `en-US` porque mantiene el
 * orden dia/mes y el reloj de 24 h que pide el diseno (01/04/23, 10:45).
 */
const LOCALE = 'en-GB';

/** 01/04/23 */
export function formatDate(timestamp?: number | null): string {
  if (!timestamp) return '--/--/--';
  return new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(timestamp);
}

/** 10:45 */
export function formatTime(timestamp?: number | null): string {
  if (!timestamp) return '--:--';
  return new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(timestamp);
}

/** 10:30 PM */
export function formatTime12h(timestamp?: number | null): string {
  if (!timestamp) return '--:--';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(timestamp);
}

/** 14 October 2023 */
export function formatLongDate(timestamp?: number | null): string {
  if (!timestamp) return '';
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(timestamp);
}

/**
 * Formatea una duracion en "H:MM:SS" (1:30:00).
 * Las horas no se limitan a 24: una diferencia de 3 dias se lee "72:14:07".
 */
export function formatCountdown(ms?: number | null): string {
  const safe = Math.max(0, ms ?? 0);
  const hours = Math.floor(safe / HOUR);
  const minutes = Math.floor((safe % HOUR) / MINUTE);
  const seconds = Math.floor((safe % MINUTE) / SECOND);

  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
