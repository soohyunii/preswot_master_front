import { NightwatchBrowser } from 'nightwatch';

// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

export default {
  '랜딩 페이지 렌더링': (client: NightwatchBrowser) => {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = client.globals.devServerURL as string;

    client
      .url(devServer)
      .waitForElementVisible('#app', 1000);

    client.expect.element('body').to.be.present.before(1000);

    client.expect.element('body').text.to.contain('인기 강의 목록');

    client.end();
  },
};
