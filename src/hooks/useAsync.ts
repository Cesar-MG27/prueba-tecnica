import { useCallback, useEffect, useState } from 'react';
import type { DependencyList } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Ejecuta una promesa asociada al ciclo de vida del componente.
 * Cancela con AbortController al desmontar o al cambiar las dependencias.
 */
export function useAsync<T>(
  task: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    task(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
      })
      .catch((err: unknown) => {
        // StrictMode aborta el primer efecto en desarrollo: no es un error real.
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return { data, loading, error, refetch };
}
