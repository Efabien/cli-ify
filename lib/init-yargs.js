const _ = require('lodash');
const {
  errorHandler,
  promptHandler,
  utilitiesInjector
} = require('./decorators');

const path = require('path');

const registerCommands = (commands, yargs, settings, execDir) => {
  commands.reduce((yargs, command) => {
    const cmd =  Object.keys(command)[0];
    const argv = command[cmd].argv ?
      ` [${command[cmd].argv}]` :
      '';
    let func = errorHandler(require(path.resolve(execDir, `${command[cmd].module}`)));

    if (command[cmd].prompts && command[cmd].prompts.length) {
      func = promptHandler(
        func,
        {
          prompts: command[cmd].prompts,
          config: settings.interactivity
        }
      );
    }
    func = utilitiesInjector(func);
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
