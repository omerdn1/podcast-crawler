import { OK } from 'http-status-codes';

import { Router } from 'express';
import v1 from './v1';

const globalRouter = Router();

globalRouter.get(['/', '/status'], (_, res) =>
  res.status(OK).json({ status: 'ok' }),
);

export { globalRouter, v1 };
