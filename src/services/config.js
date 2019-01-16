/* eslint-disable import/prefer-default-export */

const serverUrl = 'http://13.125.182.116';

const backPort = 8090;
const socketPort = 8091;
/*
const isTest = document.URL.includes('13.124.196.202');
const isProd = document.URL.includes('preswot');

if (isProd) {
  serverUrl = 'http://13.125.31.75'; // 실서버
  backPort = 8000;
  socketPort = 8001;
} else if (isTest) {
  serverUrl = 'http://13.125.249.159';
  backPort = 8000;
  socketPort = 8001;
}

현재 테스트 중인건
13.125.182.116
8090 8091

/*
// 로컬 서버 테스트용
serverUrl = 'http://localhost';
backPort = 8000;
*/

export const baseUrl = `${serverUrl}:${backPort}`;
export const websocketUrl = `${serverUrl}:${socketPort}`;
