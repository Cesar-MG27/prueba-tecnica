/**
 * Extrae la ciudad de una direccion de Google Maps.
 * "Perif. Blvd. ... , Valle Dorado, 54020 Tlalnepantla de Baz, Mex., Mexico"
 *   -> "Tlalnepantla de Baz"
 */
export function getCityFromAddress(address?: string | null): string {
  if (!address) return '';

  const parts = address.split(',').map((part) => part.trim());
  // El formato habitual termina en "<ciudad>, <estado>, <pais>".
  const city = parts.length >= 3 ? parts[parts.length - 3] : parts[0];

  // La ciudad suele venir precedida del codigo postal: "54020 Tlalnepantla de Baz".
  return city.replace(/^\d{4,6}\s+/, '');
}
