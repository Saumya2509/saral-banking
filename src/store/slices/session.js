// Saral Banking — Session slice
// Manages: logged-in customer, role (customer/guardian), lock state

export const initialState = {
  customerId: null,
  role: 'customer', // 'customer' | 'guardian'
  lockedAt: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_CUSTOMER':
      return {
        ...state,
        customerId: action.payload || null,
        lockedAt: null,
      };

    case 'SIGN_OUT':
      return {
        ...state,
        customerId: null,
        lockedAt: null,
      };

    case 'SET_ROLE':
      return {
        ...state,
        role: action.payload || 'customer',
      };

    case 'LOCK':
      return {
        ...state,
        lockedAt: action.payload || new Date().toISOString(),
      };

    case 'UNLOCK':
      return {
        ...state,
        lockedAt: null,
      };

    default:
      return state;
  }
}
