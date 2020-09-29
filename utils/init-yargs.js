const _ = require('lodash');

const registerCommands = (commands, yargs) => {
  commands.reduce((yargs, command) => {
    const cmd =  Object.keys(command)[0];
    const argv = command[cmd].argv ?
      ` [${command[cmd].argv}]` :
      ''
    const func = require(`../modules/${command[cmd].module}`);
    return yargs
      .command(`${cmd}${argv}`, command[cmd].describe, (yargs) => {}, func);
  }, yargs);
};

const registerOptions = (options, yargs) => {
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
