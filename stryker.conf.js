/** @type {import('@stryker-mutator/api/core').StrykerOptions} */
module.exports = {
  mutate: [
    'src/utils/**/*.js',
  ],
  testRunner: 'vitest',
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'off',
  vitest: {
    project: './',
    configFile: 'vitest.config.js',
  },
  tempDirName: '.stryker-tmp',
};
