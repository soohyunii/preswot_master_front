/* eslint-disable import/prefer-default-export */

// const serverUrl = 'http://localhost';
let serverUrl = 'http://165.132.105.33';

let backPort = 3000;
let socketPort = 8001;

// const isDev = true;
const isTest = document.URL.includes('52.78.131.124');
if (isTest) {
  serverUrl = '13.125.245.55';
  backPort = 8000;
  socketPort = 8001;
}

export const baseUrl = `${serverUrl}:${backPort}`;
export const websocketUrl = `${serverUrl}:${socketPort}`;
