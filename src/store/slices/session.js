// Saral Banking — Session slice
// Manages: logged-in customer, role (customer/guardian), lock state

export const initialState = {
  customerId: 'shankar',
  role: 'customer', // 'customer' | 'guardian'
  lockedAt: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_CUSTOMER':
      return {
        ...state,
        customerId: action.payload || 'shankar',
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
