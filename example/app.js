const CliIfy = require('../index.js');

const cliIfy = new CliIfy();

const log = (input, logger) => {
  logger.warn(input);
};

cliIfy.init(
  {
    manifest: './cli-ify.yml',
    dependencies: {
      log
    }
  }
);
