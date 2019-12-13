import Joi from '@hapi/joi';

require('dotenv').config();

/**
 * Property definitions:
 * Each definition is set as required by default.
 * To make it optional - use .optional().
 */
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

/* Schemas */
const feedSchema = Joi.object({
  podcast_url,
});

const transcribeSchema = Joi.object({
  url,
});

export default { feedSchema, transcribeSchema };
