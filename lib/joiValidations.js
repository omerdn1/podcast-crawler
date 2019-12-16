import Joi from '@hapi/joi';

require('dotenv').config();

// Validate podcast URL
const podcast_url = Joi.string()
  .required()
  .regex(new RegExp(`^${process.env.APPLE_PODCAST_DOMAIN}`))
  .messages({
    'string.pattern.base': `"{{#label}}" should be a valid podcast URL`,
  });

// Validate URL
const url = Joi.string()
  .required()
  .uri();

// Validate file
const file = Joi.object({
  _writeStream: Joi.object().required(),
})
  .required()
  .unknown();

export { podcast_url, url, file };
