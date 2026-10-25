// Saral Banking — Records slice
// Manages: service requests, card state, UPI limits, nominee, contact overrides, problem reports

export const initialState = {
  serviceRequests: [],
  cardState: {
    blocked: false,
    upiBlocked: false,
  },
  upiLimits: {
    dailyPaise: 10000000, // ₹1,00,000
  },
  nominee: null,
  contactOverrides: {},
  problemReports: [],
};

export function reducer(state, action) {
  switch (action.type) {
    // --- Service requests ---
    case 'ADD_SERVICE_REQUEST': {
      const sr = action.payload;
      if (!sr || !sr.id) return state;
      if (state.serviceRequests.some((r) => r.id === sr.id)) return state;
      return {
        ...state,
        serviceRequests: [
          ...state.serviceRequests,
          { ...sr, status: sr.status || 'open', createdAt: sr.createdAt || new Date().toISOString() },
        ],
      };
    }

    case 'UPDATE_SERVICE_REQUEST': {
      const { id, ...updates } = action.payload || {};
      if (!id) return state;
      return {
        ...state,
        serviceRequests: state.serviceRequests.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        ),
      };
    }

    case 'REMOVE_SERVICE_REQUEST': {
      return {
        ...state,
        serviceRequests: state.serviceRequests.filter((r) => r.id !== action.payload),
      };
    }

    // --- Card state ---
    case 'SET_CARD_BLOCKED':
      return {
        ...state,
        cardState: { ...state.cardState, blocked: Boolean(action.payload) },
      };

    case 'SET_UPI_BLOCKED':
      return {
        ...state,
        cardState: { ...state.cardState, upiBlocked: Boolean(action.payload) },
      };

    // --- UPI limits ---
    case 'SET_UPI_DAILY_LIMIT':
    case 'SET_UPI_LIMITS': {
      const raw =
        typeof action.payload === 'object' && action.payload !== null
          ? action.payload.dailyPaise
          : action.payload;
      const parsed = Math.round(Number(raw));
      return {
        ...state,
        upiLimits: {
          ...state.upiLimits,
          dailyPaise: !Number.isNaN(parsed) && parsed > 0 ? parsed : 10000000,
        },
      };
    }

    // --- Nominee ---
    case 'SET_NOMINEE':
      return {
        ...state,
        nominee: action.payload || null,
      };

    case 'REMOVE_NOMINEE':
      return {
        ...state,
        nominee: null,
      };

    // --- Contact overrides ---
    case 'UPDATE_CONTACT':
    case 'SET_CONTACT_OVERRIDE': {
      const updates =
        action.payload?.field && action.payload?.value !== undefined
          ? { [action.payload.field]: action.payload.value }
          : action.payload || {};
      return {
        ...state,
        contactOverrides: { ...state.contactOverrides, ...updates },
      };
    }

    case 'CLEAR_CONTACT_OVERRIDES':
      return {
        ...state,
        contactOverrides: {},
      };

    // --- Problem reports ---
    case 'ADD_PROBLEM_REPORT': {
      const report = action.payload;
      if (!report || !report.id) return state;
      if (state.problemReports.some((r) => r.id === report.id)) return state;
      return {
        ...state,
        problemReports: [
          ...state.problemReports,
          { ...report, status: report.status || 'open', createdAt: report.createdAt || new Date().toISOString() },
        ],
      };
    }

    case 'UPDATE_PROBLEM_REPORT': {
      const { id, ...updates } = action.payload || {};
      if (!id) return state;
      return {
        ...state,
        problemReports: state.problemReports.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        ),
      };
    }

    case 'REMOVE_PROBLEM_REPORT':
      return {
        ...state,
        problemReports: state.problemReports.filter((r) => r.id !== action.payload),
      };

    default:
      return state;
  }
}
