const yaml = require('js-yaml');
const fs   = require('fs');
const logger = require('../lib/logger');

const config = yaml.safeLoad(fs.readFileSync('./cli-ify.yml', 'utf8'));
module.exports = config;
