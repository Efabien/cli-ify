const colors = require('colors/safe');

const error = (label, data) => {
  console.log(colors.error(label));
  if (data) {
    console.log(colors.error(data));
  }
};

const data = (payload) => {
  console.log(colors.data(payload));
};

const info = (message) => {
  console.log(colors.info(message));
};

const setTheme = (theme) => {
  colors.setTheme(theme);
};

const warn = (payload) => {
  console.log(colors.warn(payload));
};

module.exports = {
  data,
  error,
  info,
  warn,
  setTheme
};
