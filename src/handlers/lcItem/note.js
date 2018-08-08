import LcItemHandler from './index';
import noteService from '../../services/noteService';
// import fileService from '../../services/fileService';
import utils from '../../utils';

export default class NoteHandler extends LcItemHandler {
  /* eslint-disable no-param-reassign */
  static async initViewModel(vm) {
    const item = vm.lectureItem;
    const n = item.notes[0];

    switch (n.type) {
      case 0: {
        vm.inputBody.noteType = 'IMAGE';
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'file', vm.$refs.noteEditor.$refs.noteUpload.uploadFiles);
          if (n.file[0] !== undefined) {
            vm.$refs.noteEditor.$refs.noteUpload.uploadFiles.push({
              name: n.file[0].name,
            });
            vm.$set(vm.inputTail, 'oldfile', {
              name: n.file[0].name,
            });
          }
        });
        break;
      }
      case 1: {
        vm.inputBody.noteType = 'DOCS';
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'file', vm.$refs.noteEditor.$refs.noteUpload.uploadFiles);
          if (n.file[0] !== undefined) {
            vm.$refs.noteEditor.$refs.noteUpload.uploadFiles.push({
              name: n.file[0].name,
            });
            vm.$set(vm.inputTail, 'oldfile', {
              name: n.file[0].name,
            });
          }
        });
        break;
      }
      case 2: {
        vm.inputBody.noteType = 'LINK';
        vm.$set(vm.inputTail, 'url', n.url);
        break;
      }
      case 3: {
        vm.inputBody.noteType = 'YOUTUBE';
        vm.$set(vm.inputTail, 'url', n.url);
        // FIXME: 백엔드쪽에서 데이터가 어떤 형태로 올지 모르기 때문에 추후 수정.
        const start = new Date(2018, 8, 15, 0, 0, 0);
        start.setSeconds(n.youtube_interval);
        const end = new Date(2018, 8, 15, 0, 0, 0);
        end.setSeconds(n.youtube_interval);
        vm.$set(vm.inputTail, 'interval', [start, end]);
        break;
      }
      default: {
        throw new Error(`not defined note type ${n.type}`);
      }
    }
  }

  // @Override
  static async postChildLectureItem({ lcItemId, inputBody, inputTail }) {
    const res1 = await noteService.postNote({
      lectureItemId: lcItemId,
    });
    const noteId = res1.data.note_id;
    this.putChildLectureItem({ noteId, inputBody, inputTail });
  }

  static async putChildLectureItem({ noteId, inputBody, inputTail }) {
    const noteType = utils.convertNoteType(inputBody.noteType);

    const start = (3600 * inputTail.interval[0].getHours()) +
      (60 * inputTail.interval[0].getMinutes()) + inputTail.interval[0].getSeconds();
    const end = (3600 * inputTail.interval[1].getHours()) +
      (60 * inputTail.interval[1].getMinutes()) + inputTail.interval[1].getSeconds();

    await noteService.putNote({
      noteId,
      type: noteType,
      url: inputTail.url,
      youtube_interval: `${start}<?>${end}`,
    });

    if (inputBody.noteType === 'IMAGE' || inputBody.noteType === 'DOCS') {
      if (inputTail.oldfile !== undefined) {
        if (inputTail.file[0] === undefined) {
          // TODO: 파일삭제
        }
        // eslint-disable-next-line
        if (inputTail.file !== undefined && inputTail.file[0] !== undefined && inputTail.file[0].raw !== undefined) {
          // TODO: 파일삭제
          noteService.postNoteFile({
            noteId,
            file: inputTail.file[0].raw,
          });
        }
      }

      if (inputTail.oldfile === undefined) {
        // eslint-disable-next-line
        if (inputTail.file !== undefined && inputTail.file[0] !== undefined && inputTail.file[0].raw !== undefined) {
          noteService.postNoteFile({
            noteId,
            file: inputTail.file[0].raw,
          });
        }
      }
    }
  }
}
