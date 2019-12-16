import axios from 'axios';
import { JSDOM } from 'jsdom';
import Parser from 'rss-parser';
import { OK } from 'http-status-codes';
import Boom from '@hapi/boom';
import fs from 'fs';
import { stripQueryStringFromURL } from 'lib/URLManipulation';
import otterApi from 'config/otterApi';

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
  } catch (err) {
    return next(Boom.badImplementation(err));
  }
};

const getSpeeches = async (req, res, next) => {
  try {
    const speeches = await otterApi.getSpeeches();
    return res.status(OK).json(speeches);
  } catch (err) {
    return next(Boom.badImplementation(err));
  }
};

const uploadSpeech = async (req, res, next) => {
  try {
    const { file } = req.files;
    const stream = fs.createReadStream(file.path);

    const response = await otterApi.uploadSpeech({
      value: stream,
      options: { filename: file.name },
    });

    return res.status(OK).json(response);
  } catch (err) {
    return next(Boom.badImplementation(err));
  }
};

export default {
  getPodcastFeed,
  getSpeeches,
  uploadSpeech,
};
