const colors = require('colors/safe');
const theme = {
  silly: 'rainbow',
  input: 'grey',
  verbose: 'blue',
  prompt: 'cyan',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
};

colors.setTheme(theme);

const error = (label, data) => {
  console.log(colors.error(label));
  if (data) {
    console.log(colors.error(data));
  }
};

const data = (payload) => {
  console.log(colors.data(payload));
}

const info = (message) => {
  console.log(colors.info(message));
};

module.exports = {
  data,
  error,
  info
};
