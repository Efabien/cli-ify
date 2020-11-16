const CliIfy = require('../index.js');

const cliIfy = new CliIfy();

const log = (input, logger) => {
  logger.info(input);
};

cliIfy.init(
  {
    manifest: './cli-ify.yml',
    dependencies: {
      log
    }
  }
);
