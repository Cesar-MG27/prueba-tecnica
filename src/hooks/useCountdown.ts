import { useEffect, useState } from 'react';
import { formatCountdown } from '@/utils/date';

const TICK_MS = 1000;

function getRemaining(target: number | null): number | null {
  if (target == null) return null;
  return Math.max(0, target - Date.now());
}

interface Countdown {
  timeLeft: number | null;
  formatted: string;
  isElapsed: boolean;
}

/**
 * Cuenta regresiva hasta `target` (epoch ms).
 *
 * Cada tick recalcula la diferencia absoluta contra Date.now() en lugar de
 * restar 1s: asi no se desfasa si la pestana pasa a segundo plano o el equipo
 * se suspende. Si la fecha ya paso no se crea ningun intervalo.
 */
export function useCountdown(target: number | null): Countdown {
  const [timeLeft, setTimeLeft] = useState<number | null>(() => getRemaining(target));

  useEffect(() => {
    const initial = getRemaining(target);
    setTimeLeft(initial);

    if (initial == null || initial <= 0) return;

    const intervalId = window.setInterval(() => {
      const remaining = getRemaining(target);
      setTimeLeft(remaining);

      if (remaining != null && remaining <= 0) {
        window.clearInterval(intervalId);
      }
    }, TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [target]);

  return {
    timeLeft,
    formatted: formatCountdown(timeLeft),
    isElapsed: timeLeft != null && timeLeft <= 0,
  };
}
