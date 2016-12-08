/**
* index.js
* @flow
**/

import path from 'path';
import engine from './engine';

// logic operator and or not

const source = path.join(__dirname, '../data/big.csv');
const pipe: string = `
  max(timeStamp) |
  min(timeStamp) |
  percentiles(elapsed, [ 5 ]) |
  count(timeStamp) |
  sum(elapsed) |
  avg(bytes)
`;


engine(pipe, source);
