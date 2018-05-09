import { NightwatchBrowser } from 'nightwatch';


function generateRandomEmail() {
  const id = Math.random().toString(36).substring(7);
  return `${id}@register-test.com`;
}

const testPassword = 'adjadj1234';
export default {
  '정상적인 회원가입': (client: NightwatchBrowser) => {
    const devServer = client.globals.devServerURL as string;

    client.url(devServer)
      .waitForElementVisible('#app', 5000);

    // 로그인 되지 않은 상황에서
    client.expect.element('a[href="/login"]').to.be.present.before(1000);

    // 회원가입 페이지로 가서
    client.click('a[href="/register"]')
      .waitForElementVisible('.register-wrapper', 1000);
    // client.expect.url().to.be.contain('register');
    client.assert.urlContains('register');
    client.expect.element('label[for="email_id"]').to.be.present.before(1000);

    // 값들을 채워넣는다.
    client.setValue('#email_id input', generateRandomEmail());
    client.setValue('#password input', testPassword);
    client.setValue('#password2 input', testPassword);

    client.setValue('#name input', 'test name');
    client.setValue('#birth input', '1992-05-06');
    // client.setValue('#address1 input', '경기도 고양시 덕양구 은빛마을5단지 화중로 164');
    // 아니 쉬1뻘 새창에서 iframe 선택해서 하려는데 안돼서
    // el-input에 readonly 지워버리고
    // vm.input.address1 연결해서 해결함 찢어버리고 싶다 셀레니움
    // client.click('#btn_search_address')
    //   .pause(2000);
    // client.windowHandles((result) => {
    //   const original = result.value[0];
    //   const popup = result.value[1];
    //   client.switchWindow(popup);
    //   client.pause(2000);
    //   client.frame('#__daum__viewerFrame_1')
    //     .setValue('#region_name', '화중로 164')
    //     .setValue('#region_name', client.Keys.ENTER)
    //     .pause(2000)
    //     .click('.related_address button.link_post')
    //     .pause(500)
    //     .closeWindow();
    //   client.switchWindow(original);
    // });
    client.setValue('#address1 input', '셀레니움을 주깁시다');

    client.setValue('#address2 input', '513동 102호');
    client.setValue('#phoneNumber input', '010-9955-1693');

    client.setValue('#major input', '컴퓨터과학과');
    client.setValue('#belong input', '연세대');
    client.click('#checkTou span.el-checkbox__label');

    // 클릭이 되는건지 안되는건지
    client.click('#btn_submit_register');
    client.pause(500);
    client.saveScreenshot('./what.png');

    client.assert.urlEquals(devServer + '/');
    // client.expect.url().to.be.contain('register');
    // client.end();
  },
};