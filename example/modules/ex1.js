const func = (arg, { logger, spinnerFactory, dependencies }) => {
  dependencies.log('foo', logger);
  const spinner = spinnerFactory.create('wait');
  spinner.start();
  logger.data(arg);
  spinner.succeed();
};

module.exports = func;
