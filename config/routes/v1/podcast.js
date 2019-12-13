import { Router } from 'express';
import { joiValidator } from 'app/v1/controllers';
import { schemas, getBase64AudioFromURL } from 'app/v1/controllers/podcast';
import { podcast } from 'app/v1/modules';

const podcastRouter = Router();
podcastRouter.get(
  '/feed',
  joiValidator.query(schemas.feedSchema),
  podcast.getPodcastFeed,
);
podcastRouter.get(
  '/transcribe',
  joiValidator.query(schemas.transcribeSchema),
  getBase64AudioFromURL,
  podcast.transcribeEpisode,
);

export default podcastRouter;
