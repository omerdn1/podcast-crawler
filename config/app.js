import express from 'express';
import OtterApi from 'otter-ai-api';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import Boom from '@hapi/boom';
// const { requestLogger, errorLogger } = require('./logger');
import { globalRouter, v1 } from './routes/index';

require('dotenv').config();

const app = express();

const otterApi = new OtterApi({
  email: process.env.OTTER_EMAIL,
  password: process.env.OTTER_PASSWORD,
});

setTimeout(async () => {
  const speeches = await otterApi.getSpeeches();
  speeches.forEach(async (speech, index) => {
    const speechInfo = await otterApi.getSpeech(speech.speech_id);
    console.log(`SPEECH #${index}:`);
    console.log(speechInfo);
  });
}, 5000);

// app.use(otterApi);
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
