const _ = require('lodash');
const {
  errorHandler,
  progressHandler,
  promptHandler
} = require('./decorators');

const registerCommands = (commands, yargs, settings) => {
  commands.reduce((yargs, command) => {
    const cmd =  Object.keys(command)[0];
    const argv = command[cmd].argv ?
      ` [${command[cmd].argv}]` :
      '';
    let func = errorHandler(require(`../modules/${command[cmd].module}`));

    if (command[cmd].progress) {
      func = progressHandler(func);
    }

    if (command[cmd].prompts && command[cmd].prompts.length) {
      func = promptHandler(
        func,
        {
          prompts: command[cmd].prompts,
          config: settings.interactivity
        }
      );
    }

    return yargs
      .command(`${cmd}${argv}`, command[cmd].describe, (yargs) => {}, func);
  }, yargs);
};

const registerOptions = (options, yargs, settings) => {
  options.forEach(option => {
    for (let key in option) {
      yargs.option(key, _.pick(option[key], ['alias', 'type', 'description']))
    }
  });
};

module.exports = {
  registerCommands,
  registerOptions
};
