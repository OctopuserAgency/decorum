module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['karma-typescript', 'mocha', 'chai', 'sinon'],
    files: [
      'src/**/*.ts',
      'tests/**/*.ts',
    ],
    exclude: [
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
      'tests/**/*.ts': ['karma-typescript'],
    },
    reporters: ['progress', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['jsdom'],
    singleRun: false,
    concurrency: Infinity,
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
    },
  });
};
