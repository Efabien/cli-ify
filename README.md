# cli-ify

## Description
The aim of this project is ease the implementation of a node.js based cli.

The core concept is based on the cli-ify.yml file where commands, options and modules are declared.

-----

### The cli-ify.yml file
This is where the settings, commands and options are declared.

#### Settings
This is where how the look of the cli will be set.<br>
Here is an example of a working settings:

    settings:
      interactivity:
        label: ' '
        delimiter: ' '
      theme:
        silly: rainbow
        input: grey
        verbose: blue
        prompt: cyan
        info: green
        data: grey
        help: cyan
        warn: yellow
        debug: blue
        error: red
    ...
The theme section here set the colors of the different log level.

#### Commands
Commands are declared in the commands section, which is an array of objects.

    ...
    commands:
      - ex1:
          description: An example of command
          module: ./modules/ex1.js
    ...

Each item of commands being an object, each item's key is the command name and each item's value is an object itself, which for clarity will be named command entity.<br>

##### Command entity
The command entity should at least contain two value.<br>

- ###### description
It is a string explaining what the command does

- ###### module
It is a string indicating the relative path to a js file.<br>
This js file should contain an exported callback function.<br>
The callback function takes as first argument an object which contains the data from standard input<br>
The second argument is an object containing utilities like looger, spinnerFactory and dependencies.<br>
Here is what a module could look like:

```js
const func = async (arg, { logger, spinnerFactory, dependencies }) => {
  const { apiClient } = dependencies;
  const spinner = spinnerFactory.create('Loading data ...');
  spinner.start();
  const data = await apiClient.getData();
  logger.data(data);
  spinner.succeed();
};

module.exports = func;
```
### Examples
For a more practical approach, please refer to the [examples](https://github.com/Efabien/cli-ify/tree/master/example)


