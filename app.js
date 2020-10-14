const {
  commands,
  options,
  settings
} = require('./config');
const yargs = require('yargs');

const {
  registerCommands, 
  registerOptions
} = require('./lib/init-yargs');

const run = (commands, options, settings) => {
  registerCommands(commands, yargs, settings);
  registerOptions(options, yargs, settings);
  yargs.argv;
};

run(commands, options, settings);
