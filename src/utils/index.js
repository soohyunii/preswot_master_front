import getLocale from 'browser-locale';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

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
    const payload = jwtDecode(jwt);
    return Date.now() < payload.exp;
  },
  formatDate(d) {
    // console.log('formatDate', d, d.toLocaleDateString('en-US').split('-'));
    // eslint-disable-next-line
    return moment(d).format('YYYY-MM-DD HH:mm:ss');
  },
};
