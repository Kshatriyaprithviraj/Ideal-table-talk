const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDependencies = [
  ['_', 'lodash'],
  ['passport', 'passport'],
];

simpleDependencies.forEach(function (value) {
  container.register(value[0], function () {
    return require(value[1]);
  });
});

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container', function () {
  return container;
});

module.exports = container;
