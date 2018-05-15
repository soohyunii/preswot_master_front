// import getLocale from 'browser-locale';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import isNil from 'lodash.isnil';
import isBoolean from 'lodash.isboolean';
import isNumber from 'lodash.isnumber';

// eslint-disable-next-line
const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export default {
  getJwtFromLocalStorage() {
    const jwt = localStorage.getItem('jwt') || '';
    // TODO: Check expiration date periodically
    // TODO: Check expiration date left > 24hrs or not

    // if jwt is expired, erase it then return empty string
    if (this.isJwtExpired(jwt)) {
      localStorage.setItem('jwt', '');
      return '';
    }
    return jwt;
  },
  getDefaultLocale() {
    // TODO: 나중에 로케일 작업하면 밑에 코드로 바꾸기
    // const browserLocale = getLocale().split('-')[0];
    // return localStorage.getItem('locale') || browserLocale || 'ko';
    return 'ko';
  },
  isJwtExpired(jwt) {
    if (!jwt) {
      return true;
    }
    // const encodedPayload = jwt.split('.')[1];
    // console.log('encodedPayload', encodedPayload);
    // const payload = JSON.parse(atob(encodedPayload));
    // console.log('payload', payload);
    let isExpired;
    try {
      const payload = jwtDecode(jwt);
      isExpired = Date.now() < payload.exp;
    } catch (error) {
      isExpired = true;
    }
    return isExpired;
  },
  getEmailFromJwt() {
    const jwt = this.getJwtFromLocalStorage();
    if (jwt.length === 0) {
      return null;
    }
    let email;
    try {
      email = jwtDecode(jwt).email_id;
    } catch (error) {
      email = null;
    }
    return email;
  },
  getUserIdFromJwt() {
    const jwt = this.getJwtFromLocalStorage();
    if (jwt.length === 0) {
      return null;
    }
    // TODO: try cath jwtDecode
    return jwtDecode(jwt).authId;
  },
  formatDate(d) {
    // console.log('formatDate', d, d.toLocaleDateString('en-US').split('-'));
    // eslint-disable-next-line
    return moment(d).format('YYYY-MM-DD HH:mm:ss');
  },
  formatSec2Time(secs, format) {
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - (hr * 3600)) / 60);
    let sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (hr < 10) {
      hr = `0${hr}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }
    if (sec < 10) {
      sec = `0${sec}`;
    }
    if (hr) {
      hr = '00';
    }

    if (format != null) {
      let formattedTime = format.replace('hh', hr);
      formattedTime = formattedTime.replace('mm', min);
      formattedTime = formattedTime.replace('ss', sec);
      return formattedTime;
    }
    return `${hr}:${min}:${sec}`;
  },
  convertScType(scType) {
    const mapping = ['강의', '숙제', '퀴즈', '시험'];
    if (typeof scType === 'number') {
      return mapping[scType];
    } else if (typeof scType === 'string') {
      return mapping.indexOf(scType);
    }
    return new Error(`not defined scType ${scType}`);
  },
  convertScItemType(scItemType) {
    const mapping = ['문항', '설문', '강의자료', '숙제', '실습', '토론'];
    if (typeof scItemType === 'number') {
      return mapping[scItemType];
    } else if (typeof scItemType === 'string') {
      return mapping.indexOf(scItemType);
    }
    return new Error(`not defined scItemType ${scItemType}`);
  },
  convertQuestionType(questionType) {
    const mapping = ['객관', '단답', '서술', 'SW', 'SQL'];
    if (typeof questionType === 'number') {
      return mapping[questionType];
    } else if (typeof questionType === 'string') {
      return mapping.indexOf(questionType);
    }
    return new Error(`not defined questionType ${questionType}`);
  },
  // convertScItemOrder(scItemOrder) {
  //   const mapping = ['예습', '본강의', '복습'];
  //   if (typeof scItemOrder === 'number') {
  //     return mapping[scItemOrder];
  //   } else if (typeof scItemOrder === 'string') {
  //     return mapping.indexOf(scItemOrder);
  //   }
  //   return new Error(`not defined scItemOrder ${scItemOrder}`);
  // },
  convertBoolean(b) {
    if (isBoolean(b)) {
      return b === true ? 1 : 0;
    } else if (isNumber(b)) {
      return b === 1;
    }
    return new Error(`not defined b ${b}`);
  },
  isValidEmail(emailString) {
    return re.test(emailString);
  },
  assignIfNotNil(p, variable, newKey) {
    const originalKey = Object.keys(variable)[0];
    const key = newKey || originalKey;
    // console.log('assignIfNotNil', key, variable);
    if (!isNil(variable[originalKey])) {
      Object.assign(p, { [key]: variable[originalKey] });
    }
  },
  sortSc(sc, currentEditingScItemIndex) {
    const beforeSortedScItem = sc[currentEditingScItemIndex];
    let tempMap = new Map();
    sc.forEach((item, index) => {
      tempMap.set(item, index);
    });
    // for (let i = 0; i < sc.length; i += 1) { window.console.log('before sort', sc[i].id); }
    const activeSortedSc = sc.sort((a, b) => {
      const diff = a.activeStartOffsetSec - b.activeStartOffsetSec;
      if (diff !== 0) { return diff; }
      return tempMap.get(a) - tempMap.get(b);
    });
    // for (let i = 0; i < sc.length; i += 1) { window.console.log('active sort', sc[i].id); }

    tempMap = new Map();
    activeSortedSc.forEach((item, index) => {
      tempMap.set(item, index);
    });
    const orderSortedSc = activeSortedSc.sort((a, b) => {
      const diff = a.order - b.order;
      if (diff !== 0) { return diff; }
      return tempMap.get(a) - tempMap.get(b);
    });
    // for (let i = 0; i < sc.length; i += 1) { window.console.log('order sort', sc[i].id); }

    const changedCurrentEditingScItemIndex = sc.map(x => x.id).indexOf(beforeSortedScItem.id);
    return { orderSortedSc, changedCurrentEditingScItemIndex };
  },
  downloadFile(url, filename) {
    console.log('downloadFile', url); // eslint-disable-line
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      document.body.removeChild(link);
    }, 1000);
  },
};
