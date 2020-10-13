const logger = require('./logger');
const cliProgress = require('cli-progress');

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

module.exports = {
  errorHandler,
  progressHandler
};
