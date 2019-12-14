import { Router } from 'express';
import Joi from '@hapi/joi';
import { joiValidator, getBase64AudioFromURL } from 'app/v1/middleware';
import { podcast } from 'app/v1/controllers';
import { podcast_url, url } from 'lib/joiValidations';

/* Validation Schemas */
const feedSchema = Joi.object({
  podcast_url,
});

const transcribeSchema = Joi.object({
  url,
});

const podcastRouter = Router();
podcastRouter.get(
  '/feed',
  joiValidator.query(feedSchema),
  podcast.getPodcastFeed,
);
podcastRouter.get(
  '/transcribe',
  joiValidator.query(transcribeSchema),
  getBase64AudioFromURL,
  podcast.transcribeEpisode,
);

export default podcastRouter;
