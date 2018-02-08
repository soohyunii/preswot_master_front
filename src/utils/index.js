import getLocale from 'browser-locale';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import isNil from 'lodash.isnil';

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
    const browserLocale = getLocale().split('-')[0];
    return localStorage.getItem('locale') || browserLocale || 'ko';
  },
  isJwtExpired(jwt) {
    if (!jwt) {
      return true;
    }
    // const encodedPayload = jwt.split('.')[1];
    // console.log('encodedPayload', encodedPayload);
    // const payload = JSON.parse(atob(encodedPayload));
    // console.log('payload', payload);
    // TODO: try cath jwtDecode
    const payload = jwtDecode(jwt);
    return Date.now() < payload.exp;
  },
  getEmailFromJwt() {
    const jwt = this.getJwtFromLocalStorage();
    if (jwt.length === 0) {
      return null;
    }
    // TODO: try cath jwtDecode
    return jwtDecode(jwt).email_id;
  },
  formatDate(d) {
    // console.log('formatDate', d, d.toLocaleDateString('en-US').split('-'));
    // eslint-disable-next-line
    return moment(d).format('YYYY-MM-DD HH:mm:ss');
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
    const mapping = ['문항', '설문', '강의자료', '숙제'];
    if (typeof scItemType === 'number') {
      return mapping[scItemType];
    } else if (typeof scItemType === 'string') {
      return mapping.indexOf(scItemType);
    }
    return new Error(`not defined scItemType ${scItemType}`);
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
};
