const path = require('path');
const vueLoaderConfig = require('../build/vue-loader.conf');
const devWebpackConfig = require('/home/adoji/git/dblab-academy-front/build/webpack.dev.conf');
const utils = require('../build/utils');
console.log(1);

// const defaultStorybookVueWebpackConfig = require('../node_modules/@storybook/vue/dist/server/config/webpack.config.js').default('./webpack.config');

// console.log('deeee', defaultStorybookVueWebpackConfig);
// module.exports = devWebpackConfig;
// function resolve(dir) {
//   return path.join(__dirname, '..', dir)
// }

module.exports = (baseConfig, env, defaultConfig) => {
  console.log('baseConfig', baseConfig);
  console.log('env', env);
  console.log('default', defaultConfig);
  // resolve: {
  //   alias: {
  //     // 'vue$': 'vue/dist/vue.esm.js',
  //     '@': path.resolve(__dirname, '../src'),
  //   },
  // },
  // module: {
  //   rules: [
  //     {
  //       test: /\.vue$/,
  //       loader: 'vue-loader',
  //       options: vueLoaderConfig
  //     },
  //     {
  //       test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  //       loader: 'url-loader',
  //       options: {
  //         limit: 10000,
  //         name: utils.assetsPath('img/[name].[hash:7].[ext]')
  //       }
  //     },
  //     // {
  //     //   test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
  //     //   loader: 'url-loader',
  //     //   options: {
  //     //     limit: 10000,
  //     //     name: utils.assetsPath('media/[name].[hash:7].[ext]')
  //     //   }
  //     // },
  //     // {
  //     //   test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  //     //   loader: 'url-loader',
  //     //   options: {
  //     //     limit: 10000,
  //     //     name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
  //     //   }
  //     // },
  //     // {
  //     //   test: /.s[ac]ss$/,
  //     //   loaders: ['style', 'css', 'sass'],
  //     //   include: path.resolve(__dirname, '../src'),
  //     // },
  //   ],
  // },
  defaultConfig.resolve.alias['@'] = path.resolve(__dirname, '../src');
  return defaultConfig;
};
