const FALLBACK_BASE_URL = 'https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io';

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? FALLBACK_BASE_URL;

/**
 * El mock de Postman se duerme por inactividad y la primera peticion paga el
 * arranque en frio. Medido tras 5 min de reposo: 4.9s de los cuales 4.7 fueron
 * espera del servidor (la conexion y el TLS tomaron 0.19s). Ya caliente
 * responde en ~0.4s.
 *
 * En movil hay que sumar DNS y handshake sobre datos celulares, por eso 10s se
 * quedaban cortos y la primera carga siempre caia en el estado de error.
 */
export const REQUEST_TIMEOUT_MS = 30_000;
