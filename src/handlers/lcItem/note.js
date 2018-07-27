import LcItemHandler from './index';
import noteService from '../../services/noteService';
import utils from '../../utils';

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

    // const res = await noteService.getNoteFile({
    //   noteId: n.note_id,
    // });
    // vm.$refs.noteEditor.initialFileList = res.data.file;

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
        vm.$set(vm.inputTail, 'URL', n.URL);
        break;
      }
      case 3: {
        vm.inputBody.noteType = 'YOUTUBE';
        vm.$set(vm.inputTail, 'URL', n.URL);
        vm.$set(vm.inputTail, 'video_start', n.videoStart);
        vm.$set(vm.inputTail, 'video_end', n.videoEnd);
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

    // TODO: add params
    await noteService.putNote({
      noteId,
      type: noteType,
      URL: inputTail.URL,
      video_start: inputTail.video_start,
      video_end: inputTail.video_end,
    });

    await noteService.deleteNoteKeywords({
      noteId,
    });

    await noteService.postNoteKeywords({
      noteId,
      data: inputTail.assignedKeywordList,
    });

    if (inputBody.noteType === 'IMAGE' || inputBody.noteType === 'DOCS') {
      if (inputTail.oldfile !== undefined) {
        if (inputTail.file[0] === undefined) {
          noteService.deleteNoteFile({ noteId });
        }
        if (inputTail.file !== undefined
          && inputTail.file[0] !== undefined
          && inputTail.file[0].raw !== undefined) {
          await noteService.deleteNoteFile({ noteId });
          noteService.postNoteFile({
            noteId,
            file: inputTail.file[0].raw,
          });
        }
      }

      if (inputTail.oldfile === undefined) {
        if (inputTail.file !== undefined
          && inputTail.file[0] !== undefined
          && inputTail.file[0].raw !== undefined) {
          noteService.postNoteFile({
            noteId,
            file: inputTail.file[0].raw,
          });
        }
      }
    }
  }
}
