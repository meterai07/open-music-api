const Joi = require("joi");

const authenticationPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports = { authenticationPayloadSchema };