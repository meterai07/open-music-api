const Joi = require('joi');

const albumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const albumIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = { albumPayloadSchema, albumIdSchema };
