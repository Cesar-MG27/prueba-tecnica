import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/config';
import type { ApiResponse } from '@/types/order';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Combina el signal del caller con un temporizador propio.
 *
 * Se arma a mano en lugar de usar `AbortSignal.any()` y `AbortSignal.timeout()`:
 * la primera solo existe desde Safari 17.4 y rompia la app en iOS con
 * "AbortSignal.any is not a function". Con un AbortController normal funciona
 * en cualquier navegador que soporte fetch.
 *
 * Devuelve tambien un `cancel` para limpiar el timer y el listener cuando la
 * peticion termina, y no dejar temporizadores colgados.
 */
function withTimeout(signal: AbortSignal | undefined, ms: number) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort(new DOMException(`Request timed out after ${ms}ms`, 'TimeoutError'));
  }, ms);

  const abortFromCaller = () => controller.abort(signal?.reason);

  if (signal) {
    if (signal.aborted) abortFromCaller();
    else signal.addEventListener('abort', abortFromCaller);
  }

  const cancel = () => {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abortFromCaller);
  };

  return { signal: controller.signal, cancel };
}

/**
 * Cliente HTTP unico. Valida el envoltorio { status, result } de la API
 * y devuelve directamente `result`.
 */
export async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const combined = withTimeout(signal, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: combined.signal,
    });

    if (!response.ok) {
      throw new ApiError(`Request to ${path} failed`, response.status);
    }

    const body = (await response.json()) as ApiResponse<T>;

    if (body.status !== 200) {
      throw new ApiError(`Invalid response from ${path}`, body.status);
    }

    return body.result;
  } finally {
    combined.cancel();
  }
}
