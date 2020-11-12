module.exports = (args, { logger, spinnerFactory, dependencies }, inputs) => {
  logger.info(args);
  logger.data(inputs)
};