import getLocale from 'browser-locale';

export default {
  getJwtFromLocalStorage() {
    const jwt = localStorage.getItem('jwt') || '';
    // TODO: Replace dummy validation
    // TODO: Check expiration date periodically
    if (jwt.endsWith('unexpired')) {
      return jwt;
    }
    // if jwt is expired, erase it then return empty string
    localStorage.setItem('jwt', '');
    return '';
  },
  getDefaultLocale() {
    const browserLocale = getLocale().split('-')[0];
    return localStorage.getItem('locale') || browserLocale || 'ko';
  },
};
