import axios from 'axios';
import { JSDOM } from 'jsdom';
import Parser from 'rss-parser';
import { SpeechClient } from '@google-cloud/speech';
import { OK } from 'http-status-codes';
import Boom from '@hapi/boom';
import { stripQueryStringFromURL } from 'lib/URLManipulation';

const getPodcastFeed = async (req, res, next) => {
  try {
    const { podcast_url } = req.query;
    const url = stripQueryStringFromURL(podcast_url);

    const response = await axios({
      method: 'GET',
      url,
      // timeout: 10000,
    });

    const { window } = new JSDOM(response.data);
    const emberElement = window.document.getElementById(
      'shoebox-ember-data-store',
    );
    const { name, genreNames, description, websiteUrl, feedUrl } = JSON.parse(
      emberElement.innerHTML,
    ).data.attributes;

    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);
    const episodes = feed.items.reduce((acc, item) => {
      acc.push({
        title: item.title,
        description: item.itunes.summary,
        url: item.enclosure.url,
        duration: item.itunes.duration,
      });
      return acc;
    }, []);

    return res.status(OK).json({
      name,
      description: description.standard,
      genres: genreNames,
      number_of_eposides: episodes.length,
      since: feed.items[feed.items.length - 1].pubDate,
      website: websiteUrl,
      feed_url: feedUrl,
      episodes,
    });
  } catch (error) {
    return next(Boom.badImplementation(error));
  }
};

const transcribeEpisode = async (req, res, next) => {
  try {
    const { base64File } = req;

    // Creates a speech client
    const client = new SpeechClient();
    const audio = {
      // TODO: replace base64 file with GS URL
      content: base64File,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableWordTimeOffsets: true,
      enableAutomaticPunctuation: true,
    };
    const request = {
      audio,
      config,
    };

    // Detects speech in the audio file
    const [operation] = await client.longRunningRecognize(request);
    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
    return res.status(OK).json({
      transcription,
      words: response.results[0].alternatives[0].words,
    });
  } catch (error) {
    return next(Boom.badImplementation(error));
  }
};

export default {
  getPodcastFeed,
  transcribeEpisode,
};
