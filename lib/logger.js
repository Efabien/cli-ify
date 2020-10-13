const colors = require('colors/safe');

colors.setTheme({
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
});

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
