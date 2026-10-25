// Saral Banking — Young Saver slice
// Manages: savings goals, guardian consent, daily spending limit

export const initialState = {
  goals: [],
  consent: {
    given: false,
    date: null,
  },
  dailyLimitPaise: 100000, // ₹1,000
};

export function reducer(state, action) {
  switch (action.type) {
    // --- Goals ---
    case 'ADD_GOAL': {
      const goal = action.payload;
      if (!goal || !goal.id) return state;
      if (state.goals.some((g) => g.id === goal.id)) return state;
      return {
        ...state,
        goals: [
          ...state.goals,
          {
            ...goal,
            savedPaise: goal.savedPaise || 0,
            targetPaise: goal.targetPaise || 0,
            createdAt: goal.createdAt || new Date().toISOString(),
          },
        ],
      };
    }

    case 'UPDATE_GOAL': {
      const { id, ...updates } = action.payload || {};
      if (!id) return state;
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
        ),
      };
    }

    case 'REMOVE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };

    // --- Consent ---
    case 'SET_CONSENT':
      return {
        ...state,
        consent: {
          given: Boolean(action.payload),
          date: action.payload ? new Date().toISOString() : null,
        },
      };

    // --- Daily limit ---
    case 'SET_DAILY_LIMIT':
      return {
        ...state,
        dailyLimitPaise: Math.round(Number(action.payload) || 100000),
      };

    default:
      return state;
  }
}
