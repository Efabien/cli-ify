const func = (arg, { logger, spinnerFactory, dependencies }) => {
  dependencies.log('foo', logger)
  const spinner = spinnerFactory.create('wait');
  spinner.start();
  throw Error('foo error');
  logger.data(arg);
  spinner.succeed();
};

module.exports = func;
