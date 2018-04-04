const path = require('path');
const vueLoaderConfig = require('../build/vue-loader.conf');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolve: {
    alias: {
      '@': resolve('../src'),
    },
  },
  // module: {
  //   loaders: [
  //     {
  //       test: /\.vue$/,
  //       loader: 'vue-loader',
  //       options: vueLoaderConfig
  //     },
  //   ],
  // },
};
