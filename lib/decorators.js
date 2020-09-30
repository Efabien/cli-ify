const logger = require('./logger');

const errorHandler = (func) => {
  return function() {
     try {
       return func.apply(this, arguments);
     } catch (e) {
       logger.error('Something went wrong : ', e)
     }
   }
};

module.exports = {
  errorHandler
};
