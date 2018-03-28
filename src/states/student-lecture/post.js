import StudentLectureStateImpl from './parent';

export default class StudentLecturePostState extends StudentLectureStateImpl {
  // eslint-disable-next-line class-methods-use-this
  isVideoVisible() {
    return false;
  }
}
