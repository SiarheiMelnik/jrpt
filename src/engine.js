
/**
* index.js
* @flow
**/

import R from 'ramda';
import * as csp from 'js-csp';
import createPipe from './queryparser';
import * as DataSource from './datasources';

const listenDataSource = (stream: Object): Object => {
  stream.pause();
  const ch = csp.chan(csp.buffers.sliding(1));
  stream.on('data', d => csp.putAsync(ch, d));
  stream.once('end', () => ch.close());
  stream.resume();
  return ch;
};

const exec = (fn, data) => fn(data);
const callPipe = R.curry((fns, data) =>
  R.map(fn => exec(fn, data))(fns)
);


function* run(fnsPipe, dataSource) {
  console.time('T');
  const ch = listenDataSource(dataSource);
  const fns = R.pipe(createPipe, callPipe)(fnsPipe);

  let obj;

  while (csp.CLOSED !== (obj = yield ch)) {
    fns(obj);
  }
  console.timeEnd('T');
}

export default (pipe, source) => {
  csp.go(run, [pipe, DataSource.csv(source)]);
};

