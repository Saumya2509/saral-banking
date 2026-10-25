// Saral Banking — Assembled English translations
// Dev 1 owns this file; assembles parts from Dev 1 (core), Dev 2 (pay), Dev 3 (records)

import core from './parts/en.core.js';
import pay from './parts/en.pay.js';
import records from './parts/en.records.js';

export default {
  ...core,
  ...pay,
  ...records,
};
