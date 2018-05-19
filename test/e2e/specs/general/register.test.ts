import { NightwatchBrowser } from 'nightwatch';


function generateRandomEmail() {
  const id = Math.random().toString(36).substring(7);
  return `${id}@register-test.com`;
}

const testPassword = 'adjadj1234';
export default {
  '회원가입은 모든 필드에 올바른 값을 넣었을 떄 회원을 생성해야한다.': (client: NightwatchBrowser) => {
    const devServer = client.globals.devServerURL as string;

    client.url(devServer)
      .waitForElementVisible('#app', 5000);

    // 로그인 되지 않은 상황에서
    client.expect.element('a[href="/login"]').to.be.present.before(1000);

    // 회원가입 페이지로 가서
    client.click('a[href="/register"]')
      .waitForElementVisible('#register_wrapper', 1000);
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

    client.click('#btn_submit_register');
    client.pause(500);
    // client.saveScreenshot('./what.png');

    client.assert.urlEquals(devServer + '/');
    client.end();
  },
  // '중간에 로그인하면 어떻게 됨? 다음 테스트? client.end()랑 상관있남?': (client: NightwatchBrowser) => {
  // // 이거 실행되고 다음꺼 실행된다는 가정하에, client.end() 없으면 로그인한채로 넘어감
  //   const devServer = client.globals.devServerURL as string;
  //   client.url(devServer)
  //     .waitForElementVisible('#app', 5000);
  //   client.click('a[href="/login"]')
  //     .waitForElementVisible('#login_wrapper', 1000);
  //   client.click('#btn_login'); // 값이 이미 입력되어있으니까 바로 클릭해버리기
  //   client.end();
  // },
  '회원가입은 폼에 invalid한 값이 들어왔을 떄 적절한 타입의 경고를 띄우고 가입을 막아야한다.': (client: NightwatchBrowser) => {
    const devServer = client.globals.devServerURL as string;

    client.url(devServer)
      .waitForElementVisible('#app', 5000);

    // 로그인 되지 않은 상황에서
    client.expect.element('a[href="/login"]').to.be.present.before(1000);

    // 회원가입 페이지로 가서
    client.click('a[href="/register"]')
      .waitForElementVisible('#register_wrapper', 1000);
    client.assert.urlContains('register');
    client.expect.element('label[for="email_id"]').to.be.present.before(1000);
    client.setValue('#email_id input', 'asdf');
    client.click('body').pause(100); // focus 지우기
    client.expect.element('#email_id .el-form-item__error').text.to.be.equal('유효하지 않은 이메일입니다.');

    // TODO: 나머지 validation


    client.end();
  },
};