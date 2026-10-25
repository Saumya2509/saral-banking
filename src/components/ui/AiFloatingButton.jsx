import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AssistantChatIcon } from '../icons/Icons';
import { useI18n } from '../../i18n/index.js';

/**
 * Compact Floating Action Button for the Saral AI Chatbot.
 * Placed in the lower-right side above the navigation bar.
 */
export default function AiFloatingButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useI18n();

  // Hide on auth, splash, or when already inside the chat screen
  const hiddenRoutes = ['/signin', '/splash', '/help/chat'];
  if (hiddenRoutes.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <aside
      aria-label="Saral AI Assistant Shortcut"
      style={{
        position: 'fixed',
        bottom: 'calc(var(--tab-h, 64px) + 14px)',
        right: '16px',
        zIndex: 40,
      }}
    >
      {/* Main Lower-Right Circular Button */}
      <button
        type="button"
        onClick={() => navigate('/help/chat')}
        className="interactive-tap ai-fab-btn"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'var(--brand)',
          color: 'var(--brand-contrast, #ffffff)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          transition: 'transform 0.15s ease',
        }}
        aria-label={lang === 'hi' ? 'सरल एआई सहायता' : 'Ask Saral AI'}
        title={lang === 'hi' ? 'सरल एआई सहायता' : 'Ask Saral AI'}
      >
        <AssistantChatIcon size={22} />
      </button>

      <style>{`
        .ai-fab-btn:hover {
          transform: scale(1.06);
        }
      `}</style>
    </aside>
  );
}
