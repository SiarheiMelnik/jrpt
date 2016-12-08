
/**
* queryparser.js
* @flow
**/

import R from 'ramda';
import * as aggs from './aggregates';

const PIPE_SPIT_CHAR: string = '|';

const splitPipe: Function = R.pipe(
  R.match(/(\S+)+\(([^"]+)\)/),
  R.tail,
);

const toFn: Function = R.over(
  R.lensIndex(0),
  R.prop(R.__, aggs)
);


const parseArgs: any = (v: string) => {
  try {
    return JSON.parse(v);
  } catch (e) {
    return v;
  }
};

const bindArgs: Function = R.converge(
  R.apply,
  [
    R.head,
    R.pipe(R.last, R.trim, R.split(','), R.map(parseArgs)),
  ]
);

const createPipe: Function = R.pipe(
  R.trim,
  R.split(PIPE_SPIT_CHAR),
  R.map(splitPipe),
  R.map(toFn),
  R.map(bindArgs)
);

export default createPipe;
