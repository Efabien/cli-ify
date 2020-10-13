const { commands, options } = require('./config');
const yargs = require('yargs');

const {
  registerCommands, 
  registerOptions
} = require('./lib/init-yargs');

const run = (commands, options) => {
  registerCommands(commands, yargs);
  registerOptions(options, yargs);
  yargs.argv;
};

run(commands, options);
