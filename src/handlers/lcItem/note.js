import LcItemHandler from './index';
import noteService from '../../services/noteService';
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
              file_guid: n.file[0].file_guid,
            });
          }
        });
        break;
      }
      case 1: {
        vm.inputBody.noteType = 'PDF';
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'file', vm.$refs.noteEditor.$refs.noteUpload.uploadFiles);
          if (n.file[0] !== undefined) {
            vm.$refs.noteEditor.$refs.noteUpload.uploadFiles.push({
              name: n.file[0].name,
              file_guid: n.file[0].file_guid,
            });
          }
        });
        break;
      }
      case 2: {
        vm.inputBody.noteType = 'VIDEO';
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'file', vm.$refs.noteEditor.$refs.noteUpload.uploadFiles);
          if (n.file[0] !== undefined) {
            vm.$refs.noteEditor.$refs.noteUpload.uploadFiles.push({
              name: n.file[0].name,
              file_guid: n.file[0].file_guid,
            });
          }
        });
        vm.$set(vm.inputTail, 'video_start', n.video_start);
        vm.$set(vm.inputTail, 'video_end', n.video_end);
        break;
      }
      case 3: {
        vm.inputBody.noteType = 'LINK';
        vm.$set(vm.inputTail, 'URL', n.URL);
        break;
      }
      case 4: {
        vm.inputBody.noteType = 'YOUTUBE';
        vm.$set(vm.inputTail, 'URL', n.URL);
        vm.$set(vm.inputTail, 'video_start', n.video_start);
        vm.$set(vm.inputTail, 'video_end', n.video_end);
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
  }
}
