import MobileDetect from 'mobile-detect';

/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    Vue.prototype.$isProd = document.URL.includes('preswot');

    // https://www.npmjs.com/package/mobile-detect
    const MD = new MobileDetect(window.navigator.userAgent);
    Vue.prototype.$isPhone = MD.phone();

    // 일반 클래스 명을 받아서 반응형 접미사를 붙인 클래스명을 반환하는 메소드
    Vue.prototype.$addReactablePostfix = function $addReactablePostfix(className) {
      if (Vue.prototype.$isPhone) {
        return `${className}-phone`;
      }
      return `${className}`;
    };
  },
};
