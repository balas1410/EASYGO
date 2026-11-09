import { useEffect, useState } from 'react';
import { useEasyGo } from '../context/EasyGoContext';

export function useReducedMotionPreference() {
  const { settings } = useEasyGo();
  const [osReduced, setOsReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setOsReduced(mq.matches);
    const listener = (e) => setOsReduced(e.matches);
    mq.addEventListener?.('change', listener);
    return () => mq.removeEventListener?.('change', listener);
  }, []);

  return Boolean(settings?.reducedMotion || osReduced);
}
