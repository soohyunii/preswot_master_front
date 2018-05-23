/* eslint-disable import/prefer-default-export */

// let serverUrl = 'http://localhost';
// let serverUrl = 'http://165.132.105.38';
let serverUrl = 'http://13.124.236.81';

let backPort = 8002;
let socketPort = 8003;
// let backPort = 3000;


const isTest = document.URL.includes('13.124.196.202');
// const isTest = true;
if (isTest) {
  serverUrl = 'http://13.124.236.81';
  backPort = 8000;
  socketPort = 8001;
}

export const baseUrl = `${serverUrl}:${backPort}`;
export const websocketUrl = `${serverUrl}:${socketPort}`;
