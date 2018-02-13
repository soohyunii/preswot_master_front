import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
import utils from '../utils';

const axiosConfig = {
  headers: {
    'Cache-Control': 'no-cache',
  },
  adapter: throttleAdapterEnhancer(
    cacheAdapterEnhancer(axios.defaults.adapter, false),
  ),
};

const isDev = true; // TODO: replace
if (isDev) {
  axiosConfig.baseURL = 'http://localhost:3000';
  // axiosConfig.baseURL = 'http://165.132.105.33:3000';
}

const jwt = utils.getJwtFromLocalStorage();
if (jwt) {
  axiosConfig.headers['x-access-token'] = jwt;
}

export default axios.create(axiosConfig);

export const baseURL = axiosConfig.baseURL;
