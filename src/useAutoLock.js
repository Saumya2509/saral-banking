// Saral Banking — Inactivity Auto-Lock Hook
// Locks after 2 minutes (120,000ms) with a 15-second warning

import { useEffect, useRef } from 'react';

export function useAutoLock(onLock, ms = 120000, warnMs = 15000, onWarn) {
  const lockTimer = useRef(null);
  const warnTimer = useRef(null);

  const reset = () => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);

    if (onWarn) {
      warnTimer.current = setTimeout(() => {
        onWarn();
      }, Math.max(0, ms - warnMs));
    }

    if (onLock) {
      lockTimer.current = setTimeout(() => {
        onLock();
      }, ms);
    }
  };

  useEffect(() => {
    const events = ['click', 'keydown', 'touchstart', 'scroll', 'mousemove'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (lockTimer.current) clearTimeout(lockTimer.current);
      if (warnTimer.current) clearTimeout(warnTimer.current);
    };
  }, [onLock, onWarn, ms, warnMs]);
}

export default useAutoLock;
