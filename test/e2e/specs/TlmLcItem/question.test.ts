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

    client.pause(400);
    // client.saveScreenshot('./sdf.png');
    // client.click('a#btn_teacher_home')
    //   .waitForElementVisible('.el-table__row', 5000);
    client.url(`${devServer}/a/teacher/NNclass`)
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

    // Click 본강
    client.click('#radio_type label:nth-child(2)');

    // 문항 선택
    client.click('#lc_item_type .el-radio-group label:nth-child(1)');
    client.setValue('#lc_item_name input', 'item name');

    // 단답 선택
    client.click('#question_type .el-radio-group label:nth-child(1)');

    client.setValue('#question textarea', '1 + 1 = ?');
    client.setValue('#textarea_short_answer textarea', '2');
    client.setValue('#keyword input:nth-child(1)', '키워드1');
    client.setValue('#input_keyword_point', '5');
    client.click('#keyword button');

    client.click('#lecture_item_editor_submit_button_wrapper button');

    client.saveScreenshot('./sdf.png');

    client.end();
  },
};
