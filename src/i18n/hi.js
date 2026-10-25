// Saral Banking — Assembled Hindi translations
// Dev 1 owns this file; assembles parts from Dev 1 (core), Dev 2 (pay), Dev 3 (records)

import core from './parts/hi.core.js';
import pay from './parts/hi.pay.js';
import records from './parts/hi.records.js';

export default {
  ...core,
  ...pay,
  ...records,
};
