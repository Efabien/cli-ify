const { commands, options } = require('./config');
const yargs = require('yargs');

const {
  registerCommands, 
  registerOptions
} = require('./utils/init-yargs');

const run = (commands, options) => {
  registerCommands(commands, yargs);
  registerOptions(options, yargs);
  yargs.argv;
};

try {
  run(commands, options);
} catch (e) {
  console.log(e);
};
