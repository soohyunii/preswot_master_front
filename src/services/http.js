import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
import utils from '../utils';
import { baseUrl } from './config';

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
  axiosConfig.baseURL = baseUrl;
}

const jwt = utils.getJwtFromLocalStorage();
if (jwt) {
  axiosConfig.headers['x-access-token'] = jwt;
}

export default axios.create(axiosConfig);
