const _ = require('lodash');
const colors = require('colors');
const logger = require('./logger');
const cliProgress = require('cli-progress');
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

const progressHandler = (func) => {
  return function() {
    const barPorgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const recursive = async (...arguments) => {
      let progression = arguments[arguments.length - 2];
      const barPorgress = arguments[arguments.length - 1];
      if (progression === 0) {
        barPorgress.start(100, progression);
      }
      if (progression >= 100) {
        barPorgress.stop();
        return logger.info('Done');
      }
      const { progress } = await func.apply(this, [...arguments]);
      progression += progress;
      barPorgress.update(progression);
      return recursive.apply(this, [...arguments].concat([progression, barPorgress]));
    };
    return recursive.apply(this, [...arguments].concat([0, barPorgress]));
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

module.exports = {
  errorHandler,
  progressHandler,
  promptHandler,
};
