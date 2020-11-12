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
       logger.error('Something went wrong : ', e)
     }
   }
};

const promptHandler = (func, { prompts , config }) => {
  return async function() {
    const properties = prompts.reduce((result, item) => {
      const key = Object.keys(item)[0];
      return _.merge(
        result,
        {
          [key]: { description: colors.magenta(item[key].description) }
        }
      );
    }, {});
    prompt.message = colors.blue(config.label);
    prompt.delimiter = colors.green(config.delimiter);
    const inputs = await startPrompt({ properties });
    return func.apply(this, [...arguments].concat([inputs]));
  };
}

const startPrompt = (properties) => {
  return new Promise((resolve, reject) => {
    prompt.get(properties, (err, inputs) => {
      if (err) return reject(err);
      return resolve(inputs);
    });
  });
};

const utilitiesInjector = (func, settings, dependencies) => {
  logger.setTheme(settings.theme);
  return function() {
    return func.apply(this, [...arguments].concat([{ logger, spinnerFactory, dependencies }]))
  };
};

module.exports = {
  errorHandler,
  promptHandler,
  utilitiesInjector
};
