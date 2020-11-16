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

module.exports = {
  data,
  error,
  info,
  setTheme
};
