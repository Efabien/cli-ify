/* eslint-disable  no-useless-computed-key */
const Joi = require('joi');

const settingsSchema = Joi.object({
  interactivity: Joi.object({
    label: Joi.string().required(),
    delimiter: Joi.string().required()
  }).required(),
  theme: Joi.object({
    silly: Joi.string().required(),
    input: Joi.string().required(),
    verbose: Joi.string().required(),
    prompt: Joi.string().required(),
    info: Joi.string().required(),
    data: Joi.string().required(),
    help: Joi.string().required(),
    warn: Joi.string().required(),
    debug: Joi.string().required(),
    error: Joi.string().required()
  }).required()
}).required();

const subCommands = Joi.array().items(
  Joi.object().pattern(
    /^/,
    Joi.object({
      describe: Joi.string().required(),
      ['sub-module']: Joi.string().required()
    }).required()
  ).required()
).optional();

const prompts = Joi.array().items(Joi.object().pattern(
  /^/,
  Joi.object({
    description: Joi.string().required(),
    flag: Joi.string().required()
  }).required()
).required()).optional();

const commandsSchema = Joi.array().items(Joi.object().pattern(
  /^/,
  Joi.object({
    describe: Joi.string().required(),
    module: Joi.string().required(),
    ['sub-commands']: subCommands,
    prompts,
    argv: Joi.string().optional()
  }).required()
  ).required())
.required();

const optionsSchema = Joi.array().items(Joi.object().pattern(
  /^/,
  Joi.object({
    alias: Joi.string().required(),
    type: Joi.string().valid('boolean', 'string', 'number').required(),
    description: Joi.string().required()
  }).required()
).required()).optional();

module.exports = {
  settingsSchema,
  commandsSchema,
  optionsSchema
};
