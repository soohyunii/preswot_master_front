/* eslint-disable import/prefer-default-export */

let serverUrl = 'http://13.125.249.159';

let backPort = 8090;
let socketPort = 8021;

const isTest = document.URL.includes('13.124.196.202');
const isProd = document.URL.includes('preswot');

if (isProd) {
  serverUrl = 'http://13.125.31.75';
  backPort = 8000;
  socketPort = 8001;
} else if (isTest) {
  serverUrl = 'http://13.125.249.159';
  backPort = 8000;
  socketPort = 8001;
}

/*
// 로컬 서버 테스트용
serverUrl = 'http://localhost';
backPort = 8000;
*/

export const baseUrl = `${serverUrl}:${backPort}`;
export const websocketUrl = `${serverUrl}:${socketPort}`;
