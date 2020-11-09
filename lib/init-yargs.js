const _ = require('lodash');
const {
  errorHandler,
  promptHandler,
  utilitiesInjector
} = require('./decorators');

const path = require('path');

const getOperation = (commandEntity, execDir) => {
  if (commandEntity['sub-commands']) {
    return {
      handler: (arg, utils) => {
        const subCommandEntity = commandEntity['sub-commands'].find(subCommand => {
          return Object.keys(subCommand)[0] === arg['sub-cmd'];
        });
        if (!subCommandEntity) {
          return utils.logger.error(`Invalid sub-command ${arg['sub-cmd']}`);
        }
        const func = require(
          path.resolve(
            execDir,
            `${commandEntity.module}/${subCommandEntity[arg['sub-cmd']]['sub-module']}`
          )
        );
        return func.apply(this, [arg, utils]);
      },
      describe: commandEntity.describe
    };
  }
  const handler = require(path.resolve(execDir, commandEntity.module));
  return {
    handler,
    describe: commandEntity.describe,
    prompts: commandEntity.prompts
  };
};

const handlePrompts = (func, operation, settings) => {
  if (!operation.prompts || !operation.prompts.length) return func;
  return promptHandler(
    func,
    {
      prompts: operation.prompts,
      config: settings.interactivity
    }
  );
};

const registerCommands = (commands, yargs, settings, execDir) => {
  commands.reduce((yargs, command) => {
    const cmd =  Object.keys(command)[0];
    const commandEntity = command[cmd];
    const argv = commandEntity.argv ?
      ` [${commandEntity.argv}]` :
      '';
    const operation = getOperation(commandEntity, execDir);
      let func = errorHandler(operation.handler);
      func = handlePrompts(func, operation, settings);
      func = utilitiesInjector(func);
      return yargs
        .command(`${cmd}${argv}`, operation.describe, (yargs) => {}, func);
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
