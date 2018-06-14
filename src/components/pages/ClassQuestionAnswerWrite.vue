<template>
  <div class="wrapper">
    <h3>Q &amp; A</h3>
    <el-input placeholder="글 제목을 작성하세요." v-model="name"></el-input>
    <el-input placeholder="글 내용을 작성하세요." v-model="content" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
    <div>
      <el-upload
        class="upload-demo"
        action="#"
        :on-remove="handleRemove"
        multiple
        :before-remove="beforeRemove"
        :limit="3"
        :on-exceed="handleExceed"
        :http-request="doUpload">
        <el-button size="small" type="primary">파일 업로드</el-button>
      </el-upload>
    </div>
    <div v-if="storedFileList.length > 0">
      <hr>
      <h4>첨부된 파일 :</h4>
      <div :key="file.file_guid" v-for="file in storedFileList" style="margin: 20px 0px 20px 10px;">
        <span>파일명 : {{ file.name }} </span>
        <el-button type="danger" @click="onClick('DELETEFILE',file.file_guid)">X</el-button>
      </div>
    </div>
    <hr>
    <div>
      <el-button @click="onClick('WRITE')" plain>등록하기</el-button>
      <el-button @click="onClick('CANCEL')" plain>취소</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  created() {
    if (this.modifyMode === true) {
      // 이상한 경로로 접근하는 경우 vuex에 값이 남아있을 수도 있을것 같아서 가급적 component.$data로 옮겨서 사용합니다.
      this.setModifyMode({ flag: false });
      this.$data.ModifyMode = true;
      this.$data.name = this.post.name;
      this.$data.content = this.post.content;
      this.$data.storedFileList = this.post.files;
    }
  },
  computed: {
    ...mapState('board', [
      'modifyMode',
      'post',
    ]),
    ...mapGetters('class', [
      'currentTeachingClass',
    ]),
  },
  methods: {
    ...mapActions('board', [
      'postPost',
      'setModifyMode',
      'modifyPost',
      'postFile',
      'deleteFile',
      'postFileWithID',
    ]),
    async onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'WRITE': {
          // fileUidGuidMap를 기반으로 GuidList를 생성
          const fileGuidList = [];
          this.$data.fileUidGuidMap.forEach((element) => {
            fileGuidList.push(element.guid);
          });
          if (vm.$data.ModifyMode === true) {
            await vm.modifyPost({
              classId: this.$route.params.classId,
              name: vm.$data.name,
              content: vm.$data.content,
              fileGuid: fileGuidList,
              boardId: vm.post.board_id,
            });
          } else {
            await vm.postPost({
              classId: this.$route.params.classId,
              name: vm.$data.name,
              content: vm.$data.content,
              fileGuid: fileGuidList,
            });
          }
          vm.$router.push(`/a/class/${this.$route.params.classId}/questionanswer/0`);
          break;
        }
        case 'CANCEL': {
          vm.$router.go(-1);
          break;
        }
        case 'DELETEFILE': {
          const res = await vm.deleteFile({
            fileGuid: arg,
          });
          if (res.data.success !== true) {
            break;
          }
          vm.$data.storedFileList.forEach((element, index) => {
            if (element.file_guid === arg) {
              vm.$data.storedFileList.splice(index, 1);
            }
          });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    handleRemove(file) {
      // 파일 삭제 시, GuidMap 에서도 해당 파일 삭제
      this.$data.fileUidGuidMap.forEach((element, index) => {
        if (element.uid === file.uid) {
          this.$data.fileUidGuidMap.splice(index, 1);
        }
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file) {
      return this.$confirm(`정말 ${file.name} 파일을 삭제할까요？`);
    },
    async doUpload(req) {
      if (this.$data.ModifyMode === false) {
        const res = await this.postFile({
          file: req.file,
        });
        this.$data.fileUidGuidMap.push({
          uid: req.file.uid,
          guid: res.data.fileGuid,
        });
      } else {
        const res = await this.postFileWithID({
          classId: this.$route.params.classId,
          boardId: this.post.board_id,
          file: req.file,
        });
        this.$data.fileUidGuidMap.push({
          uid: req.file.uid,
          guid: res.data.file.fileGuid,
        });
      }
    },
  },
  data() {
    return {
      name: '',
      content: '',
      ModifyMode: false, // 수정 상태라면 true, 쓰기로 들어왔다면 false
      fileUidGuidMap: [], // el-upload 에서 전해주는 uid 값과 node Server에서 반환받은 guid값을 연결할 용도로 사용
      storedFileList: [], // detail -> 수정 으로 넘어온 경우 기존에 갖고 있던 첨부파일 목록을 보관
    };
  },
};
</script>