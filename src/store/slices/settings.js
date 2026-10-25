// Saral Banking — Settings slice
// Manages: language, text size, contrast, read-aloud, mode, bank, hide-balance

export const initialState = {
  lang: 'en',
  textSize: 'normal',    // 'normal' | 'large' | 'xlarge'
  contrast: false,
  readAloud: false,
  mode: 'standard',      // 'standard' | 'simple' | 'young'
  bankId: 'saral',
  hideBalance: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_LANG':
      return { ...state, lang: action.payload || 'en' };

    case 'SET_TEXT_SIZE':
      return { ...state, textSize: action.payload || 'normal' };

    case 'SET_CONTRAST':
      return { ...state, contrast: Boolean(action.payload) };

    case 'SET_READ_ALOUD':
      return { ...state, readAloud: Boolean(action.payload) };

    case 'SET_MODE':
      return { ...state, mode: action.payload || 'standard' };

    case 'SET_BANK_ID':
      return { ...state, bankId: action.payload || 'saral' };

    case 'SET_HIDE_BALANCE':
      return { ...state, hideBalance: Boolean(action.payload) };

    default:
      return state;
  }
}
