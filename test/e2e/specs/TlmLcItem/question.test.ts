import { NightwatchBrowser } from 'nightwatch';

export default {
  '@tags': ['question'],
  beforeEach: (client: NightwatchBrowser) => {
    // 로그인하자아
    const devServer = client.globals.devServerURL as string;

    client.url(devServer)
      .waitForElementPresent('#app', 5000);

    client.click('a[href="/login"]')
      .waitForElementPresent('#btn_login', 5000);

    client.clearValue('input[type="email"]');
    client.setValue('input[type="email"]', 'adoji92@gmail.com');
    client.clearValue('input[type="password"]');
    client.setValue('input[type="password"]', 'adjadj1234');
    client.click('#btn_login')
      .waitForElementPresent('#btn_teacher_home', 5000);

    client.click('#btn_teacher_home')
      .waitForElementVisible('.el-table__row', 5000);
    client.pause(200);
    client.click('.el-table__row')
      .waitForElementPresent('#teacher_lecture_index_wrapper', 5000);
    client.click('a[href*="manage?classId"]')
      .waitForElementPresent('div#tab-item', 5000);
    client.click('div#tab-item')
      .waitForElementPresent('#tlm_tab_lecture_item_edit_wrapper', 5000);
  },
  '단답 문항 강의 아이템이 올바른 값을 넣었을 때 생성되어야 한다': (client: NightwatchBrowser) => {
    client.click('#btn_add_new_lc_item')
      .waitForElementPresent('#lecture_item_editor_wrapper', 5000);
    client.saveScreenshot('./sdf.png');
    client.end();
  },
};
