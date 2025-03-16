const Joi = require('joi');

const albumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
});

const albumIdSchema = Joi.object({
  id: Joi.string().required()
});

// const albumCoverPayloadSchema = Joi.object({
//   headers: Joi.object({
//     'content-type': Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required()
//   }).unknown()
// });

const albumCoverPayloadSchema = Joi.object({
  'content-type': Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required()
}).unknown();

// const albumCoverPayloadSchema = Joi.object({
//   cover: Joi.any()
//       .meta({ swaggerType: 'file' })
//       .required()
//       .description('Cover image file')
// }).unknown(); // allow other fields

module.exports = { albumPayloadSchema, albumIdSchema, albumCoverPayloadSchema };