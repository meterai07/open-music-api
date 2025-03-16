const Joi = require('joi');

const songPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const songIdSchema = Joi.object({
  id: Joi.string().required(),
});

const songQuerySchema = Joi.object({
  title: Joi.string().allow(''),
  performer: Joi.string().allow(''),
});

module.exports = {
  songPayloadSchema,
  songIdSchema,
  songQuerySchema,
};
