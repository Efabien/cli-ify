const _ = require('lodash');
const colors = require('colors');
const logger = require('./logger');
const spinnerFactory = require('./spinner-factory');
const prompt = require('prompt');

const errorHandler = (func) => {
  return function() {
    try {
      return func.apply(this, arguments);
    } catch (e) {
      logger.error('Something went wrong : ', e);
      process.exit(1);
    }
  };
};

const promptHandler = (func, { prompts, config }) => {
  return async function() {
    const properties = prompts.reduce((result, item) => {
      const key = Object.keys(item)[0];
      return _.merge(
        result,
        {
          [key]: {
            description: colors.magenta(item[key].description),
            flag: item[key].flag
          }
        }
      );
    }, {});
    prompt.message = colors.blue(config.label);
    prompt.delimiter = colors.green(config.delimiter);
    const arg = arguments[0];
    const inputs = await getInputs(arg, properties);
    return func.apply(this, [...arguments].concat([inputs]));
  };
};

const getInputs = (arg, properties) => {
  const argValues = Object.keys(properties).reduce((holder, key) => {
    holder[key] = arg[key] || arg[properties[key].flag];
    return holder;
  }, {});
  const letfProperties = Object.keys(properties).reduce((holder, key) => {
    if (!argValues[key]) {
      holder[key] = properties[key];
    }
    return holder;
  }, {});
  if (_.isEmpty(letfProperties)) return argValues;
  return startPrompt({ properties: letfProperties }, argValues);
};

const startPrompt = (properties, argValues) => {
  return new Promise((resolve, reject) => {
    prompt.get(properties, (err, inputs) => {
      if (err) return reject(err);
      return resolve(_.merge(inputs, argValues));
    });
  });
};

const utilitiesInjector = (func, settings, dependencies) => {
  logger.setTheme(settings.theme);
  return function() {
    return func.apply(this, [...arguments].concat([{ logger, spinnerFactory, dependencies }]));
  };
};

module.exports = {
  errorHandler,
  promptHandler,
  utilitiesInjector
};
