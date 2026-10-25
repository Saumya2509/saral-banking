// src/data/features.js
// Mode Feature Matrix according to diff.md
// Values: 'yes' | 'tucked' | 'guardian' | 'never'

export const FEATURES = {
  // Home
  'home.recentList':     { standard: 'yes',    simple: 'tucked', young: 'yes' },
  'home.bigActions':     { standard: 'never',  simple: 'yes',    young: 'never' },
  'home.accountDetails': { standard: 'yes',    simple: 'tucked', young: 'yes' },
  'home.goals':          { standard: 'never',  simple: 'never',  young: 'yes' },

  // Pay & Bills
  'bills.pay':           { standard: 'yes',    simple: 'yes',    young: 'never' },
  'bills.recharge':      { standard: 'yes',    simple: 'yes',    young: 'never' },
  'pay.bankAccount':     { standard: 'yes',    simple: 'tucked', young: 'guardian' },
  'pay.scanQr':          { standard: 'yes',    simple: 'tucked', young: 'yes' },
  'pay.confirmOver5k':   { standard: 'never',  simple: 'yes',    young: 'never' },
  'pay.guardianLimit':   { standard: 'never',  simple: 'never',  young: 'yes' },

  // Payees
  'payees.add':          { standard: 'yes',    simple: 'yes',    young: 'guardian' },

  // History & Statements
  'history.advancedFilters': { standard: 'yes', simple: 'tucked', young: 'yes' },
  'statements.customDates':  { standard: 'yes', simple: 'tucked', young: 'yes' },

  // Services & Cards
  'cards.creditOffers':     { standard: 'yes', simple: 'never',  young: 'never' },
  'services.contactUpdate': { standard: 'yes', simple: 'yes',    young: 'guardian' },
  'services.upiLimits':     { standard: 'yes', simple: 'yes',    young: 'guardian' },
  'services.nominee':       { standard: 'yes', simple: 'yes',    young: 'guardian' },
  'services.chequeBook':    { standard: 'yes', simple: 'tucked', young: 'never' },
  'services.loans':         { standard: 'yes', simple: 'never',  young: 'never' },

  // Help
  'help.theStandard':    { standard: 'yes',    simple: 'tucked', young: 'yes' },

  // Settings
  'settings.changeMode': { standard: 'yes',    simple: 'yes',    young: 'guardian' },

  // Guardian
  'guardian.view':       { standard: 'never',  simple: 'never',  young: 'yes' },

  // Safety checks (all modes, always)
  'safety.newPayee':        { standard: 'yes', simple: 'yes', young: 'yes' },
  'safety.over10k':         { standard: 'yes', simple: 'yes', young: 'yes' },
  'safety.paymentRequest':  { standard: 'yes', simple: 'yes', young: 'yes' },
};

// Content that must never appear in a mode (loans, credit, offers)
export const BLOCKED_CONTENT = {
  young: ['loans', 'credit', 'offers', 'bills'],
};

export default FEATURES;
