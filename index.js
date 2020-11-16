const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

const yargs = require('yargs');
const callsite = require('callsite');
const Joi = require('joi');

const {
  registerCommands,
  registerOptions
} = require('./lib/init-yargs');

const {
  settingsSchema,
  commandsSchema,
  optionsSchema
} = require('./joi-schemas/schemas');

class CliIfy {
  constructor(configPath) {
    this._commands;
    this._options;
    this._settings;
    this._yargs = yargs;
    this._manifestSchema = Joi.compile({
      settings: settingsSchema,
      commands: commandsSchema,
      options: optionsSchema
    });
  }

  init({ manifest, dependencies }) {
    try {
      const execDir = this._getExecDir();
      const {
        commands,
        options,
        settings
      } = this._loadConfig(execDir, manifest);
      this._commands = commands;
      this._options = options;
      this._settings = settings;
      registerCommands(this._commands, this._yargs, this._settings, execDir, dependencies);
      registerOptions(this._options, this._yargs, this._settings);
      this._yargs.argv;
    } catch (e) {
      if (e.name && e.name === 'YAMLException') {
        return console.log(colors.red(`${e.name} : ${e.message}`));
      }

      if (e.name && e.name === 'ManifestException') {
        return console.log(colors.red(e));
      }
      return console.log(e);
    }
  }

  _loadConfig(execDir, manifest) {
    const configs = yaml.safeLoad(
      fs.readFileSync(path.resolve(execDir, manifest), 'utf8')
    );
    return this._validateSchema(configs);
  }

  _validateSchema(configs) {
    const result = this._manifestSchema.validate(configs);
    if (result.error) {
      const err = new Error(result.error.details[0].message);
      err.name = 'ManifestException';
      throw err;
    }
    return result.value;
  }

  _getExecDir() {
    const stack = callsite();
    const requester = stack[2].getFileName();
    return path.dirname(requester);
  }
};

module.exports = CliIfy;
