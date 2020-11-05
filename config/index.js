const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

const config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../cli-ify.yml'), 'utf8'));
module.exports = config;
