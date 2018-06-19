/* eslint-disable import/prefer-default-export */

let serverUrl = 'http://localhost';
// let serverUrl = 'http://165.132.105.33';

let backPort = 8000;
let socketPort = 8001;
// let backPort = 3000;

const isTest = document.URL.includes('13.124.196.202');
// const isTest = true;
const isProd = document.URL.includes('preswot');
// const isProd = true;
// const isTest = true;
if (isProd) {
  serverUrl = 'http://13.125.31.75';
  backPort = 8000;
  socketPort = 8001;
} else if (isTest) {
  serverUrl = 'http://13.124.236.81';
  backPort = 8000;
  socketPort = 8001;
}

export const baseUrl = `${serverUrl}:${backPort}`;
export const websocketUrl = `${serverUrl}:${socketPort}`;
