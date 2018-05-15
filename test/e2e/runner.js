// 1. start the dev server using production config
process.env.NODE_ENV = 'testing';

const webpack = require('webpack');
const DevServer = require('webpack-dev-server');

const webpackConfig = require('../../build/webpack.prod.conf');
const devConfigPromise = require('../../build/webpack.dev.conf');
const spawn = require('cross-spawn');

let server;

const useYarnDev = true;
devConfigPromise.then((devConfig) => {
  // 이 설정은 nightwatch.conf.js에서 globals.devServerURL에서 걍 조져버림
  if (useYarnDev) {
    return Promise.resolve();
  }
  const devServerOptions = devConfig.devServer;
  let compiler;
  const testWithProductionBuild = false;
  if (testWithProductionBuild) {
    compiler = webpack(webpackConfig);
  } else {
    compiler = webpack(devConfig);
  }
  server = new DevServer(compiler, devServerOptions);
  const port = devServerOptions.port;
  const host = devServerOptions.host;
  return server.listen(port, host);
})
.then(() => {
  // 2. run the nightwatch test suite against it
  // to run in additional browsers:
  //    1. add an entry in test/e2e/nightwatch.conf.json under "test_settings"
  //    2. add it to the --env flag below
  // or override the environment flag, for example: `npm run e2e -- --env chrome,firefox`
  // For more information on Nightwatch's config file, see
  // http://nightwatchjs.org/guide#settings-file
  let opts = process.argv.slice(2);
  if (opts.indexOf('--config') === -1) {
    opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js']);
  }
  if (opts.indexOf('--env') === -1) {
    opts = opts.concat(['--env', 'chrome']);
  }

  const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' });

  runner.on('exit', (code) => {
    if (server) {
      server.close();
    }
    process.exit(code);
  });

  runner.on('error', (err) => {
    if (server) {
      server.close();
    }
    throw err;
  });
});
