import express from 'express';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
// const cors = require('cors');
import helmet from 'helmet';
import Boom from '@hapi/boom';
// const { requestLogger, errorLogger } = require('./logger');

import { globalRouter, v1 } from './routes/index';

const app = express();

// app.use(cors());
// app.options('*', cors());
app.use(helmet());
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: false }));
// app.use(requestLogger);

// Routing
app.use('/', globalRouter);
app.use('/v1', v1);

// Catch 404 Not Found errors
app.use((req, res, next) => {
  const err = new Error(`The requested resource ${req.url} was not found.`);
  err.status = 404;
  next(err);
});

// Handle all errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.isBoom) {
    if (err.status === 404) {
      err = Boom.notFound(err);
    } else {
      // Returns a 500 Internal Server Error for unexpected errors
      err = Boom.badImplementation(err);
    }
  }

  console.log(err);
  return res.status(err.output.statusCode).json(err.output.payload);
});

// errorLogger AFTER router and error handling
// app.use(errorLogger);

export default app;
