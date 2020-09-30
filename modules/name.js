const logger = require('../lib/logger');
module.exports = async (argv) => {
  const result = await longProcess();
  logger.data(result);
};

const longProcess = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({ message: 'after 5s'});
    }, 5000)
  })
};
