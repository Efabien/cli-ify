const { options } = require('./config');
const yargs = require('yargs-interactive');

const run = (options) => {
  options.reduce((yargs, current) => {
    yargs.option(
      
    )
  }, yargs);
};

try {
  run(options);
} catch (e) {
  console.log(e);
}