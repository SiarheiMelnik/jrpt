/**
* aggregates.js
* @flow
**/

import R from 'ramda';
import { TDigest } from 'tdigest';

export const max = (fieldName: string) => {
  let computedResult = -Infinity;
  let lastComputed = -Infinity;
  const getEntity = R.propOr(-Infinity, fieldName);
  return (data) => {
    const computed = getEntity(data);
    if (computed > lastComputed ||
       computed === -Infinity && computedResult === -Infinity) {
      computedResult = lastComputed;
      lastComputed = computed;
    }
    return lastComputed;
  };
};

export const min = (fieldName: string) => {
  let computedResult = Infinity;
  let lastComputed = Infinity;
  const getEntity = R.propOr(Infinity, fieldName);
  return (data) => {
    const computed = getEntity(data);
    if (computed < lastComputed ||
       computed === Infinity && computedResult === Infinity) {
      computedResult = lastComputed;
      lastComputed = computed;
    }
    return lastComputed;
  };
};

export const percentiles = (fieldName: string, percentile: number[] = [50, 75, 99]) => {
  const td = new TDigest();
  const getEntity = R.prop(fieldName);
  const percetileFn = v => +td.percentile(v / 100);
  const mapper = R.map(percetileFn);
  return (data) => {
    const computed = getEntity(data);
    td.push(+computed);
    td.compress();
    return mapper(percentile);
  };
};

export const count = (fieldName?: string) => {
  let acc = 0;
  const getEntity = R.propOr(R.indentity, fieldName);
  return (data) => {
    const counter = R.add(acc);
    if (getEntity(data)) {
      acc = counter(1);
    }
    return acc;
  };
};

export const sum = (fieldName: string) => {
  let acc = 0;
  const getEntity = R.prop(fieldName);
  return (data) => {
    const summer = R.add(acc);
    acc = R.pipe(getEntity, summer)(data);
    return acc;
  };
};

export const avg = (fieldName: string) => {
  const summer = sum(fieldName);
  const counter = count(fieldName);
  return data => R.converge(R.divide, [summer, counter])(data);
};

export const groupby = (fieldName: string, fn=count) => {
  const byField = R.groupBy(fn);
  return data => byField(data);
};
