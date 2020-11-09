const func = (arg, utils) => {
  const spinner = utils.spinnerFactory.create('wait');
  spinner.start();
  utils.logger.data(arg);
  spinner.succeed();
};

module.exports = func;
