import StudentLectureStateImpl from './parent';

export default class StudentLectureLiveState extends StudentLectureStateImpl {
  // eslint-disable-next-line class-methods-use-this
  isVideoVisible() {
    return true;
  }
}
