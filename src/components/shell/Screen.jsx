import React from 'react';
import Header from './Header';
import TabBar from './TabBar';
import BigButton from '../ui/BigButton';

export default function Screen({
  title,
  showBack = true,
  onBack = null,
  mainAction = null,
  secondaryAction = null,
  children,
  hideTabBar = false,
  className = '',
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        position: 'relative',
        paddingBottom: hideTabBar
          ? mainAction
            ? '120px'
            : '24px'
          : mainAction
          ? '150px'
          : 'var(--tab-h, 72px)',
      }}
      className={`screen bg-fintech-mesh ${className}`}
    >
      <Header title={title} showBack={showBack} onBack={onBack} />

      <main
        style={{
          flex: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
        }}
      >
        {children}
      </main>

      {/* Main Action Bar pinned above bottom */}
      {mainAction && (
        <div
          style={{
            position: 'fixed',
            bottom: hideTabBar ? 0 : 'var(--tab-h, 64px)',
            left: 0,
            right: 0,
            maxWidth: '480px',
            margin: '0 auto',
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            padding: hideTabBar ? '14px 20px 20px 20px' : '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 25,
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
          }}
          className="main-action-bar no-print"
        >
          <BigButton
            variant={mainAction.variant || 'primary'}
            disabled={mainAction.disabled}
            disabledReason={mainAction.disabledReason}
            onClick={mainAction.onClick}
            className="btn-shimmer"
          >
            {mainAction.label}
          </BigButton>

          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              style={{
                background: 'transparent',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '10px 14px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
              className="interactive-tap hover:bg-slate-50"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}

      {!hideTabBar && <TabBar />}
    </div>
  );
}
