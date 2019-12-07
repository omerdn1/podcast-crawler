import { Router } from 'express';
import podcastRouter from './podcast';

const v1Router = Router();

v1Router.use('/podcast', podcastRouter);

export default v1Router;
