import { Router } from 'express';
import { validPodcastURL, getBase64AudioFromURL } from 'app/v1/middleware';
import { podcast } from 'app/v1/modules';

const podcastRouter = Router();

podcastRouter.get('/feed', validPodcastURL, podcast.getPodcastFeed);
podcastRouter.get(
  '/transcribe',
  getBase64AudioFromURL,
  podcast.transcribeEpisode,
);

export default podcastRouter;
