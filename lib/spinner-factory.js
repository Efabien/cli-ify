const Ora = require('ora');

module.exports = {
  create: (message, spinner = 'dots') => {
    return new Ora({
      discardStdin: false,
      text: message,
      spinner
    });
  }
};
