
/**
* datasources.js
* @flow
**/

import fs from 'fs';
import csvParser from 'csv-parser';
import R from 'ramda';

const createFileStream = (filePath: string): Object => fs.createReadStream(filePath);
const createCsvStream = (stream: Object): Object => stream.pipe(csvParser());

export const csv = R.pipe(
  createFileStream,
  createCsvStream,
);
