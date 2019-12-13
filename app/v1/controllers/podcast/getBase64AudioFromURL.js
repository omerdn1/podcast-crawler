import Boom from '@hapi/boom';
import axios from 'axios';
import { convertStreamToBase64Audio } from 'lib/ffmpeg';

export default async (req, res, next) => {
  try {
    const { url } = req.query;
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });

    const base64File = await convertStreamToBase64Audio(response.data);
    req.base64File = base64File;
    return next();
  } catch (error) {
    return next(Boom.badImplementation(error));
  }
};
