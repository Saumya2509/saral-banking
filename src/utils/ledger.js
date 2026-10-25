// Saral Banking — Central Ledger
// The single source of truth for transactions and balance computations.
// One balance rule:
// total = openingBalancePaise + sum(in) - sum(out)
// held = sum of pending guardian requests from localStorage
// available = total - held

import { getTransactionsForCustomer } from '../data/transactions.js';
import { getCustomer, getAllCustomers } from '../data/customers.js';
import { startOfDay, endOfDay } from './dates.js';

const STORAGE_KEY_EXTRA = 'saral.ledgerExtra';
const STORAGE_KEY_STORE = 'saral.v1';

/**
 * Reads user-added extra transactions from localStorage.
 * @returns {Array} Array of transaction objects
 */
function getExtraTransactions() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXTRA);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read saral.ledgerExtra:', err);
    return [];
  }
}

/**
 * Calculates held paise from pending guardian requests in saral.v1.
 * @param {string} customerId
 * @returns {number} Held paise
 */
function getHeldPaise(customerId) {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STORE);
    if (!raw) return 0;
    const store = JSON.parse(raw);
    const guardianRequests = store?.pay?.guardianRequests;
    if (!Array.isArray(guardianRequests)) return 0;

    let held = 0;
    for (const req of guardianRequests) {
      const isTarget = (req.customerId === customerId || req.childId === customerId) && req.type !== 'add_money';
      if (isTarget && req.status === 'pending') {
        held += Number(req.amountPaise || 0);
      }
    }
    return held;
  } catch (err) {
    console.error('Failed to read held paise from store:', err);
    return 0;
  }
}

/**
 * Returns all transactions for a customer (seed + extra from localStorage),
 * sorted newest first.
 * @param {string} customerId
 * @returns {Array}
 */
export function getTransactions(customerId) {
  const seedTx = getTransactionsForCustomer(customerId) || [];
  const extraTx = getExtraTransactions().filter((tx) => tx.customerId === customerId);

  // Merge with de-duplication by tx.id (extra takes precedence if ID collision occurs)
  const map = new Map();
  for (const tx of seedTx) {
    if (tx && tx.id) {
      map.set(tx.id, tx);
    }
  }
  for (const tx of extraTx) {
    if (tx && tx.id) {
      map.set(tx.id, tx);
    }
  }

  const combined = Array.from(map.values());

  // Sort newest first
  combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return combined;
}

/**
 * Idempotently adds a transaction by tx.id and saves it to localStorage ('saral.ledgerExtra').
 * Pressing confirm twice only saves once.
 * @param {object} tx - The transaction object
 * @returns {object} The saved transaction
 */
export function addTransaction(tx) {
  if (!tx || typeof tx !== 'object') {
    throw new Error('Invalid transaction payload');
  }

  const newTx = {
    ...tx,
    id: tx.id || `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    date: tx.date || new Date().toISOString(),
    amountPaise: Math.round(Number(tx.amountPaise || 0)),
  };

  if (typeof window !== 'undefined') {
    const extras = getExtraTransactions();
    const existingIndex = extras.findIndex((t) => t.id === newTx.id);

    if (existingIndex >= 0) {
      // Idempotent: already exists, don't duplicate
      return extras[existingIndex];
    }

    extras.push(newTx);
    try {
      localStorage.setItem(STORAGE_KEY_EXTRA, JSON.stringify(extras));
      // Notify listeners about ledger change
      window.dispatchEvent(new CustomEvent('saral:ledgerExtra-updated', { detail: newTx }));
    } catch (err) {
      console.error('Failed to save to saral.ledgerExtra:', err);
    }
  }

  return newTx;
}

/**
 * Computes balances for a customer according to the one balance rule:
 * total = openingBalancePaise + sum(in) - sum(out)
 * held = sum of pending guardian requests
 * available = total - held
 * @param {string} customerId
 * @returns {{ totalPaise: number, availablePaise: number, heldPaise: number }}
 */
export function getBalances(customerId) {
  const customer = getCustomer(customerId);
  const openingBalancePaise = customer?.openingBalancePaise || 0;
  const transactions = getTransactions(customerId);

  let sumIn = 0;
  let sumOut = 0;

  for (const tx of transactions) {
    const amount = Number(tx.amountPaise || 0);
    if (tx.direction === 'in') {
      sumIn += amount;
    } else if (tx.direction === 'out') {
      sumOut += amount;
    }
  }

  const totalPaise = openingBalancePaise + sumIn - sumOut;
  const heldPaise = getHeldPaise(customerId);
  const availablePaise = totalPaise - heldPaise;

  return {
    totalPaise,
    availablePaise,
    heldPaise,
  };
}

/**
 * Generates statement summary for a customer across a date range.
 * The date filter includes the whole of the first and last day.
 * @param {string} customerId
 * @param {string|Date} fromISO
 * @param {string|Date} toISO
 * @returns {{ openingPaise: number, closingPaise: number, inPaise: number, outPaise: number, transactions: Array }}
 */
export function getStatementSummary(customerId, fromISO, toISO) {
  const customer = getCustomer(customerId);
  const openingBalancePaise = customer?.openingBalancePaise || 0;
  const allTx = getTransactions(customerId);

  const startDate = startOfDay(fromISO);
  const endDate = endOfDay(toISO);
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();

  let sumInBefore = 0;
  let sumOutBefore = 0;
  let inPaise = 0;
  let outPaise = 0;
  const periodTx = [];

  for (const tx of allTx) {
    const txMs = new Date(tx.date).getTime();
    const amount = Number(tx.amountPaise || 0);

    if (txMs < startMs) {
      if (tx.direction === 'in') {
        sumInBefore += amount;
      } else if (tx.direction === 'out') {
        sumOutBefore += amount;
      }
    } else if (txMs <= endMs) {
      periodTx.push(tx);
      if (tx.direction === 'in') {
        inPaise += amount;
      } else if (tx.direction === 'out') {
        outPaise += amount;
      }
    }
  }

  const periodOpeningPaise = openingBalancePaise + sumInBefore - sumOutBefore;
  const periodClosingPaise = periodOpeningPaise + inPaise - outPaise;

  // Newest first
  periodTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    openingPaise: periodOpeningPaise,
    closingPaise: periodClosingPaise,
    inPaise,
    outPaise,
    transactions: periodTx,
  };
}

/**
 * Recomputes balances for every customer to verify integrity.
 * Returns an array of customer balance audit results.
 * @returns {Array}
 */
export function verifyBalances() {
  const customers = getAllCustomers();
  const results = customers.map((c) => {
    const txList = getTransactions(c.id);
    let sumIn = 0;
    let sumOut = 0;

    for (const tx of txList) {
      const amount = Number(tx.amountPaise || 0);
      if (tx.direction === 'in') sumIn += amount;
      else if (tx.direction === 'out') sumOut += amount;
    }

    const balances = getBalances(c.id);
    const calculatedTotal = c.openingBalancePaise + sumIn - sumOut;
    const isFormulaCorrect = balances.totalPaise === calculatedTotal;
    const isNonNegative = balances.totalPaise >= 0;

    return {
      customerId: c.id,
      name: c.name?.en || c.id,
      openingBalancePaise: c.openingBalancePaise,
      inPaise: sumIn,
      outPaise: sumOut,
      totalPaise: balances.totalPaise,
      heldPaise: balances.heldPaise,
      availablePaise: balances.availablePaise,
      txCount: txList.length,
      isValid: isFormulaCorrect && isNonNegative,
    };
  });

  if (typeof console !== 'undefined' && console.table) {
    console.table(results);
  }

  return results;
}

/**
 * Computes the total UPI outgoing paise spent today for a given customer.
 * Used for enforcing the daily UPI transaction limit.
 * @param {string} customerId
 * @returns {number} total outgoing UPI paise today
 */
export function getTodaysUpiSpending(customerId) {
  const allTx = getTransactions(customerId);
  const now = new Date();
  const todayStart = startOfDay(now).getTime();

  let spent = 0;
  for (const tx of allTx) {
    if (tx.direction !== 'out') continue;
    if (tx.type !== 'UPI') continue;
    const txMs = new Date(tx.date).getTime();
    if (txMs >= todayStart) {
      spent += Number(tx.amountPaise || 0);
    }
  }
  return spent;
}

export default {
  getTransactions,
  addTransaction,
  getBalances,
  getStatementSummary,
  verifyBalances,
  getTodaysUpiSpending,
};
