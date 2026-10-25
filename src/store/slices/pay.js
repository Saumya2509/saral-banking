// Saral Banking — Pay slice
// Manages: payees, payment requests, guardian requests, receipts

export const initialState = {
  payees: [],
  paymentRequests: [],
  guardianRequests: [],
  receipts: [],
};

export function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PAYEE': {
      const payee = action.payload;
      if (!payee || !payee.id) return state;
      // Idempotent: skip if already exists
      if (state.payees.some((p) => p.id === payee.id)) return state;
      return {
        ...state,
        payees: [...state.payees, payee],
      };
    }

    case 'REMOVE_PAYEE': {
      const payeeId = action.payload;
      return {
        ...state,
        payees: state.payees.filter((p) => p.id !== payeeId),
      };
    }

    case 'ADD_PAYMENT_REQUEST': {
      const request = action.payload;
      if (!request || !request.id) return state;
      if (state.paymentRequests.some((r) => r.id === request.id)) return state;
      return {
        ...state,
        paymentRequests: [...state.paymentRequests, request],
      };
    }

    case 'ADD_GUARDIAN_REQUEST': {
      const gReq = action.payload;
      if (!gReq || !gReq.id) return state;
      if (state.guardianRequests.some((r) => r.id === gReq.id)) return state;
      return {
        ...state,
        guardianRequests: [
          ...state.guardianRequests,
          { ...gReq, status: gReq.status || 'pending', createdAt: gReq.createdAt || new Date().toISOString() },
        ],
      };
    }

    case 'APPROVE_GUARDIAN_REQUEST': {
      const approveId = action.payload;
      return {
        ...state,
        guardianRequests: state.guardianRequests.map((r) =>
          r.id === approveId
            ? { ...r, status: 'approved', decidedAt: new Date().toISOString() }
            : r
        ),
      };
    }

    case 'DECLINE_GUARDIAN_REQUEST': {
      const declineId = action.payload;
      return {
        ...state,
        guardianRequests: state.guardianRequests.map((r) =>
          r.id === declineId
            ? { ...r, status: 'declined', decidedAt: new Date().toISOString() }
            : r
        ),
      };
    }

    case 'ADD_RECEIPT': {
      const receipt = action.payload;
      if (!receipt || !receipt.id) return state;
      if (state.receipts.some((r) => r.id === receipt.id)) return state;
      return {
        ...state,
        receipts: [...state.receipts, receipt],
      };
    }

    default:
      return state;
  }
}
