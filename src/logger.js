/**
* logger.js
* @flow
**/

import winston from 'winston';
import R from 'ramda';

const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)(),
  ],
});

export default logger;

export const logPipe = R.tap(R.bind(logger.info, logger));
