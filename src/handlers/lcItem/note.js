import LcItemHandler from './index';
import noteService from '../../services/noteService';
import fileService from '../../services/fileService';
import utils from '../../utils';
import { baseUrl } from '../../services/config';

export default class NoteHandler extends LcItemHandler {
  /* eslint-disable no-param-reassign */
  static async initViewModel(vm) {
    const item = vm.lectureItem;
    const n = item.notes[0];

    const keywordList = await noteService.getNoteKeywords({
      noteId: n.note_id,
    });
    keywordList.data.forEach((element) => {
      element.score = element.score_portion;
    });
    vm.inputTail.assignedKeywordList = keywordList.data;

    switch (n.note_type) {
      case 0: {
        vm.inputBody.noteType = 'IMAGE';
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'file', vm.$refs.noteEditor.$refs.noteUpload.uploadFiles);
          if (n.files[0] !== undefined) {
            vm.$refs.noteEditor.$refs.noteUpload.uploadFiles.push({
              name: n.files[0].name,
              file_guid: n.files[0].file_guid,
              url: `${baseUrl}${n.files[0].client_path}`,
            });
            vm.$set(vm.inputTail, 'oldfile', {
              name: n.files[0].name,
              file_guid: n.files[0].file_guid,
            });
          }
        });
        break;
      }
      case 1: {
        vm.inputBody.noteType = 'DOCS';
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'file', vm.$refs.noteEditor.$refs.noteUpload.uploadFiles);
          if (n.files[0] !== undefined) {
            vm.$refs.noteEditor.$refs.noteUpload.uploadFiles.push({
              name: n.files[0].name,
              file_guid: n.files[0].file_guid,
            });
            vm.$set(vm.inputTail, 'oldfile', {
              name: n.files[0].name,
              file_guid: n.files[0].file_guid,
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

        const interval = n.youtube_interval.split('<?>');
        const start = new Date(2018, 8, 15, 0, 0, 0);
        start.setSeconds(interval[0]);
        const end = new Date(2018, 8, 15, 0, 0, 0);
        end.setSeconds(interval[1]);
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

    let interval = null;
    if (noteType === 3) {
      const start = (3600 * inputTail.interval[0].getHours()) +
        (60 * inputTail.interval[0].getMinutes()) + inputTail.interval[0].getSeconds();
      const end = (3600 * inputTail.interval[1].getHours()) +
        (60 * inputTail.interval[1].getMinutes()) + inputTail.interval[1].getSeconds();
      interval = `${start}<?>${end}`;
    }

    await noteService.putNote({
      noteId,
      note_type: noteType,
      url: inputTail.url,
      youtube_interval: interval,
    });


    if (inputBody.noteType === 'IMAGE' || inputBody.noteType === 'DOCS') {
      // 기존 파일이 존재
      if (inputTail.oldfile !== undefined) {
        // 새 파일 없으면 수정 전 파일 삭제
        if (inputTail.file[0] === undefined) {
          fileService.deleteFile({
            fileGuid: inputTail.oldfile.file_guid,
          });
        }
        // 수정 후 파일 존재할 경우 기존 파일 삭제 및 새 파일 추가
        if (inputTail.file[0] !== undefined && inputTail.file[0].raw !== undefined) {
          fileService.deleteFile({
            fileGuid: inputTail.oldfile.file_guid,
          });
          noteService.postNoteFile({
            noteId,
            file: inputTail.file[0].raw,
          });
        }
      }
      // 수정 전 파일이 존재하지 않음
      if (inputTail.oldfile === undefined) {
        // 수정 후 파일 존재할 경우 파일 추가
        if (inputTail.file[0] !== undefined && inputTail.file[0].raw !== undefined) {
          noteService.postNoteFile({
            noteId,
            file: inputTail.file[0].raw,
          });
        }
      }
    }

    if (inputBody.noteType === 'LINK' || inputBody.noteType === 'YOUTUBE') {
      if (inputTail.oldfile !== undefined) {
        fileService.deleteFile({
          fileGuid: inputTail.oldfile.file_guid,
        });
      }
    }

    await noteService.deleteNoteKeywords({
      noteId,
    });
    await noteService.postNoteKeywords({
      noteId,
      data: inputTail.assignedKeywordList,
    });
  }
}
