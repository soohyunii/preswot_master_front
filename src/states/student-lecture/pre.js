import StudentLectureStateImpl from './parent';

export default class StudentLecturePreState extends StudentLectureStateImpl {
  // eslint-disable-next-line class-methods-use-this
  isVideoVisible() {
    return false;
  }
}
