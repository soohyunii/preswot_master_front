// import isString from 'lodash.isstring';

export const ORDER_LIST = ['PRE', 'LIVE', 'POST'];

export default class StudentLectureStateImpl {
  // constructor(order) {
  //   if (!isString(order)) {
  //     throw new Error(`order is not string, but got ${typeof order}`);
  //   }
  //   if (!ORDER_LIST.includes(order)) {
  //     throw new Error(`not defined order ${order}`);
  //   }
  //   this._order = order.toUpperCase();
  // }
  // eslint-disable-next-line class-methods-use-this
  isVideoVisible() {
    throw new Error('Should be overrided');
  }
}
