const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

const yargs = require('yargs');
const callsite = require('callsite');

const {
  registerCommands, 
  registerOptions
} = require('./lib/init-yargs');

class CliIfy {
  constructor(configPath) {

    this._commands;
    this._options;
    this._settings;
    this._yargs = yargs;
    this._execDir;
  }

  init({ manifest, dependencies }) {
    this._setExecDir();
    const {
      commands,
      options,
      settings
    }  = yaml.safeLoad(
      fs.readFileSync(path.resolve(this._execDir, manifest), 'utf8')
    );
    this._commands = commands;
    this._options = options;
    this._settings = settings;
    registerCommands(this._commands, this._yargs, this._settings, this._execDir, dependencies);
    registerOptions(this._options, this._yargs, this._settings);
    this._yargs.argv;
  }

  _setExecDir() {
    const stack = callsite();
    const requester = stack[2].getFileName();
    this._execDir = path.dirname(requester);
  }
};

module.exports = CliIfy;
