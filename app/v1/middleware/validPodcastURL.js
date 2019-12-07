import Boom from '@hapi/boom';

require('dotenv').config();

export default (req, res, next) => {
  const { podcast_url } = req.query;
  if (podcast_url && podcast_url.startsWith(process.env.APPLE_PODCAST_DOMAIN)) {
    return next();
  }

  return next(Boom.badData('Given URL is not a valid podcast URL'));
};
