require('babel-register');
const config = require('../../config');
const seleniumServer = require('selenium-server');
const chromeDriver = require('chromedriver');
// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  src_folders: ['test/e2e/dist'],
  output_folder: 'test/e2e/reports',
  custom_assertions_path: ['test/e2e/custom-assertions'],

  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': chromeDriver.path,
    },
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        // devServerURL: `http://localhost:${process.env.PORT || config.dev.port}`,
        devServerURL: `http://localhost:${config.dev.port}`,
      },

      desiredCapabilities: {
        javascriptEnabled: true,
        acceptSslCerts: true,
        databaseEnabled: true,
        webStorageEnabled: true,
      },
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
      },
    },
  },
};
