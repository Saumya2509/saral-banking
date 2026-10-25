import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/index.js';
import config from '../../data/config.js';
import AiFloatingButton from '../ui/AiFloatingButton.jsx';

export default function AppShell() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const idleTimerRef = useRef(null);

  // Apply visual theme tokens to HTML element
  useEffect(() => {
    const root = document.documentElement;
    const settings = state?.settings || {};

    root.setAttribute('data-bank', settings.bankId || 'saral');
    root.setAttribute('data-text-size', settings.textSize || 'normal');
    root.setAttribute('data-mode', settings.mode || 'standard');
    root.setAttribute('data-contrast', settings.contrast ? 'true' : 'false');
    root.setAttribute('lang', settings.lang || 'en');

    // Explicitly enforce base font size on html root
    const baseSizes = { normal: '16px', large: '20px', largest: '24px' };
    root.style.fontSize = baseSizes[settings.textSize] || '16px';
  }, [state?.settings]);

  // Check login session
  useEffect(() => {
    if (!state?.session?.customerId && location.pathname !== '/signin' && location.pathname !== '/splash') {
      const hasSeenSplash = sessionStorage.getItem('saral_has_seen_splash');
      if (!hasSeenSplash) {
        navigate('/splash', { replace: true });
      } else {
        navigate('/signin', { replace: true });
      }
    }
  }, [state?.session?.customerId, location.pathname, navigate]);

  // Idle lock timer (auto-lock after 120s of inactivity)
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (state?.session?.customerId) {
          dispatch({ type: 'LOCK', payload: new Date().toISOString() });
          navigate('/signin');
        }
      }, (config.idleLockSeconds || 120) * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, resetIdleTimer));
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, resetIdleTimer));
    };
  }, [state?.session?.customerId, dispatch, navigate]);

  return (
    <div className="app-shell min-h-screen bg-fintech-mesh text-[var(--text-primary)]">
      <Outlet />
      <AiFloatingButton />
    </div>
  );
}
