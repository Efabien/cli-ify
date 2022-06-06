const _ = require('lodash');
const omelette = require('omelette');
const {
  errorHandler,
  promptHandler,
  utilitiesInjector
} = require('./decorators');

const path = require('path');

const getOperation = (commandEntity, execDir) => {
  if (commandEntity['sub-commands']) {
    return getSubCommandOperation(commandEntity, execDir);
  }
  return {
    handler: require(path.resolve(execDir, commandEntity.module)),
    description: commandEntity.description,
    prompts: commandEntity.prompts
  };
};

const getSubCommandOperation = (commandEntity, execDir) => {
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
    description: commandEntity.description
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

const decorate = (operation, settings, dependencies) => {
  let func = errorHandler(operation.handler);
  func = handlePrompts(func, operation, settings);
  return utilitiesInjector(func, settings, dependencies);
};

const registerCommands = (commands, yargs, settings, execDir, dependencies) => {
  return commands.reduce((yargs, command) => {
    const cmd = Object.keys(command)[0];
    const commandEntity = command[cmd];
    const argv = commandEntity.argv ?
      ` [${commandEntity.argv}]` :
      '';
    const operation = getOperation(commandEntity, execDir);
    const func = decorate(operation, settings, dependencies);
    return yargs
      .command(
        `${cmd}${argv}`,
        operation.description,
        (yargs) => {
          if (!commandEntity.options) return yargs;
          commandEntity.options.forEach(option => {
            for (const key in option) {
              yargs.option(
                key,
                _.pick(
                  option[key],
                  ['alias', 'type', 'description', 'default', 'demandOption']
                )
              );
            }
          });
          return yargs;
        },
        func
      );
  }, yargs);
};

const registerOptions = (options = [], yargs, settings) => {
  options.forEach(option => {
    for (const key in option) {
      yargs.option(
        key,
        _.pick(
          option[key],
          ['alias', 'type', 'description', 'default', 'demandOption']
        )
      );
    }
  });
};

const registerAutocomplete = (commands) => {
  const completion = omelette('cli-ify <argv0> <argv1>');

  // This is your logic
  completion.on('argv0', ({ reply }) => {
    reply(commands.map(command => {
      return Object.keys(command)[0];
    }));
  });
  completion.on('argv1', ({ reply }) => {
    const subCommands = commands.reduce((subs, command) => {
      if (!command['sub-commands']) return subs;
      return subs.concat(
        command['sub-commands'].map(sub => {
          return Object.keys(sub)[0];
        })
      );
    }, []);
    reply(subCommands);
  });
  completion.init();
};

module.exports = {
  registerCommands,
  registerOptions,
  registerAutocomplete
};
