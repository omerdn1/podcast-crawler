import otterApi from 'config/otterApi';
import Boom from '@hapi/boom';

export default async (req, res, next) => {
  try {
    await otterApi.validateUploadService();

    return next();
  } catch (err) {
    console.log('Otter upload service error: ', err);
    return next(Boom.badGateway('Otter upload service seems to be down'));
  }
};
