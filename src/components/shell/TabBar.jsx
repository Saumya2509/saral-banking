import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  LandmarkIcon,
  CreditCardIcon,
  ClockIcon,
  GridIcon,
} from '../icons/Icons';
import { useI18n } from '../../i18n/index.js';

export default function TabBar() {
  const { lang, t } = useI18n();

  const tabs = [
    { to: '/', label: t('core.tab.home') || (lang === 'hi' ? 'होम' : lang === 'ta' ? 'முகப்பு' : 'Home'), icon: HomeIcon, end: true },
    { to: '/accounts', label: lang === 'hi' ? 'खाते' : lang === 'ta' ? 'கணக்குகள்' : 'Accounts', icon: LandmarkIcon },
    { to: '/cards', label: lang === 'hi' ? 'कार्ड्स' : lang === 'ta' ? 'கார்டுகள்' : 'Cards', icon: CreditCardIcon },
    { to: '/history', label: t('core.tab.history') || (lang === 'hi' ? 'इतिहास' : lang === 'ta' ? 'வரலாறு' : 'History'), icon: ClockIcon },
    { to: '/services', label: t('core.tab.services') || (lang === 'hi' ? 'सेवाएं' : lang === 'ta' ? 'சேவைகள்' : 'More'), icon: GridIcon },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '480px',
        margin: '0 auto',
        height: 'var(--tab-h, 64px)',
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 30,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
      }}
      className="tab-bar no-print"
      aria-label="Bottom Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className="interactive-tap"
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              textDecoration: 'none',
              color: isActive ? 'var(--brand)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: isActive ? 700 : 500,
              gap: '3px',
              transition: 'all 0.15s ease',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                <div style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.15s ease' }}>
                  <Icon size={21} />
                </div>
                <span>{tab.label}</span>
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '5px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand)',
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
