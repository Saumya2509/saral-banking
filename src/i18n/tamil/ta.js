import core from './ta.core.js';
import pay from './ta.pay.js';
import records from './ta.records.js';

const ta = {
  ...core,
  ...pay,
  ...records,
};

export default ta;
