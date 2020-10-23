const func = async(argv) => {
  const { progress } = await longProcess();
  return { progress };
};

const longProcess = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({ progress: generator.next().value });
    }, 1000)
  });
};

const generate = function* () {
  for (let i = 0; i <= 100; i ++) {
    yield i;
  }
};

const generator = generate();

module.exports = func;
