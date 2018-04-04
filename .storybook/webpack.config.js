const path = require('path');
const vueLoaderConfig = require('../build/vue-loader.conf');
const devWebpackConfig = require('/home/adoji/git/dblab-academy-front/build/webpack.dev.conf');
const utils = require('../build/utils');

// const defaultStorybookVueWebpackConfig = require('../node_modules/@storybook/vue/dist/server/config/webpack.config.js').default('./webpack.config');

module.exports = (baseConfig, env, defaultConfig) => {
  // console.log('baseConfig', baseConfig);
  // console.log('env', env);
  // console.log('default', defaultConfig);

  defaultConfig.resolve.alias['@'] = path.resolve(__dirname, '../src');
  return defaultConfig;
};
