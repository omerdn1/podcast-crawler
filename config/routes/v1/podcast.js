import { Router } from 'express';
import Joi from '@hapi/joi';
import formidable from 'express-formidable';
import {
  joiValidator,
  getBase64AudioFromURL,
  validateUploadService,
} from 'app/v1/middleware';
import { podcast } from 'app/v1/controllers';
import { podcast_url, url, file } from 'lib/joiValidations';

/* Validation Schemas */
const feedSchema = Joi.object({
  podcast_url,
});

const speechUploadSchema = Joi.object({
  file,
});

const podcastRouter = Router();
podcastRouter.get(
  '/feed',
  joiValidator.query(feedSchema),
  podcast.getPodcastFeed,
);
podcastRouter.get('/speeches', podcast.getSpeeches);
podcastRouter.post(
  '/speech-upload',
  formidable(),
  joiValidator.files(speechUploadSchema),
  validateUploadService,
  podcast.uploadSpeech,
);

export default podcastRouter;
