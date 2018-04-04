const path = require('path');
const vueLoaderConfig = require('../build/vue-loader.conf');
const devWebpackConfig = require('/home/adoji/git/dblab-academy-front/build/webpack.dev.conf');
const utils = require('../build/utils');

// module.exports = devWebpackConfig;
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      // {
      //   test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: utils.assetsPath('media/[name].[hash:7].[ext]')
      //   }
      // },
      // {
      //   test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      //   }
      // },
      // {
      //   test: /.s[ac]ss$/,
      //   loaders: ['style', 'css', 'sass'],
      //   include: path.resolve(__dirname, '../src'),
      // },
    ],
  },
};
