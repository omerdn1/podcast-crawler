import Boom from '@hapi/boom';

const joiReqProperties = ['query', 'body', 'params', 'headers', 'files'];

const DEFAULT_JOI_OPTIONS = {
  convert: true,
  allowUnknown: false,
  abortEarly: false,
};

function JoiValidatorMiddleware() {
  joiReqProperties.forEach(type => {
    this[type] = (schema, joiOptions = DEFAULT_JOI_OPTIONS) => {
      return (req, res, next) => {
        const result = schema.validate(req[type], joiOptions);
        if (!result.error) {
          console.log('result value: ', result.value);
          req[type] = result.value;
          next();
        } else {
          console.log('result error: ', result.error);
          result.type = type;
          next(Boom.badData(result.error.message));
        }
      };
    };
  });
}

export default new JoiValidatorMiddleware();
