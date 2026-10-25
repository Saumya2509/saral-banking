import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as sessionSlice from './slices/session.js';
import * as settingsSlice from './slices/settings.js';
import * as paySlice from './slices/pay.js';
import * as recordsSlice from './slices/records.js';
import * as youngSlice from './slices/young.js';

const STORAGE_KEY = 'saral.v1';

const initialFullState = {
  session: sessionSlice.initialState,
  settings: settingsSlice.initialState,
  pay: paySlice.initialState,
  records: recordsSlice.initialState,
  young: youngSlice.initialState,
};

function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialFullState;
    const parsed = JSON.parse(raw);
    return {
      session: { ...sessionSlice.initialState, ...parsed.session },
      settings: { ...settingsSlice.initialState, ...parsed.settings },
      pay: { ...paySlice.initialState, ...parsed.pay },
      records: { ...recordsSlice.initialState, ...parsed.records },
      young: { ...youngSlice.initialState, ...parsed.young },
    };
  } catch (e) {
    console.error('Failed to parse stored state, falling back to initial', e);
    return initialFullState;
  }
}

function rootReducer(state, action) {
  if (action.type === 'RESET_DEMO') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('saral.ledgerExtra');
    return initialFullState;
  }

  return {
    session: sessionSlice.reducer(state.session, action),
    settings: settingsSlice.reducer(state.settings, action),
    pay: paySlice.reducer(state.pay, action),
    records: recordsSlice.reducer(state.records, action),
    young: youngSlice.reducer(state.young, action),
  };
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(rootReducer, null, loadStoredState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  const resetDemo = () => {
    dispatch({ type: 'RESET_DEMO' });
  };

  return React.createElement(
    StoreContext.Provider,
    { value: { state, dispatch, resetDemo } },
    children
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}

export default StoreContext;
