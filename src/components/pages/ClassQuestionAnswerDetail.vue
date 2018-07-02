<template>
  <div class="wrapper">
    <h3>게시판</h3>
    <el-input :disabled="true" :value="name"></el-input>
    <el-input :disabled="true" :value="content" type="textarea" :autosize="{ minRows: 10, maxRows: 15}"></el-input>
    <el-button v-if="isPostOwner" @click="onClick('MODIFY')" plain>수정</el-button>
    <el-button v-if="isPostOwner" @click="onClick('DELETEPOST')" type="danger" plain>삭제</el-button>
    <el-button @click="onClick('CANCEL')" plain>뒤로가기</el-button>
    <p></p>
    <p></p>
    <div v-if="fileLength > 0">
      <hr>
      <h4>첨부된 파일 :</h4>
      <div :key="file.file_guid" v-for="file in post.files" style="margin: 20px 0px 20px 10px;">
        <span>파일명 : {{ file.name }} </span>
        <el-button @click="onClick('DOWNLOAD',file.client_path,file.name)">다운로드</el-button>
      </div>
    </div>
    <hr>
    <div style="display: inline-block; width: 500px">
      <el-input v-model="comment" placeholder="댓글을 입력하세요."></el-input>
    </div>
    <el-button @click="onClick('SAVECOMMENT')" plain>댓글저장</el-button>
    <div :key="reply.board_reply_id" v-for="reply in post.board_replies" style="margin: 20px 0px 20px 10px;">
      <span>{{ reply.user.name }}  :  {{ reply.content }}</span>
      <el-button v-if="reply.writer_id === jwtUserId" @click="onClick('DELETECOMMENT',reply.board_reply_id, reply.writer_id, jwtUserId)" type="danger" plain>X</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import utils from '../../utils';
import { baseUrl } from '../../services/config';

export default {
  async created() {
    const vm = this;
    await vm.getPost({
      classId: vm.$route.params.classId,
      boardId: vm.$route.params.boardId,
    });
    vm.$data.name = vm.post.name;
    vm.$data.content = vm.post.content;
    vm.$data.fileLength = vm.post.files.length; // 직접 대입하면 url로 바로 호출시, undefined 오류가 발생하여(?) 임시처리
    vm.$data.jwtUserId = utils.getUserIdFromJwt();
    if (vm.post.writer_id === vm.$data.jwtUserId) {
      vm.$data.isPostOwner = true;
    }
  },
  computed: {
    ...mapState('board', [
      'post',
    ]),
    ...mapGetters('class', [
      'currentTeachingClass',
    ]),
  },
  methods: {
    ...mapActions('board', [
      'getPost',
      'deletePost',
      'setModifyMode',
      'postReply',
      'deleteReply',
    ]),
    async onClick(type, arg, arg2) {
      const vm = this;
      switch (type) {
        case 'SAVECOMMENT': {
          await vm.postReply({
            boardId: this.$route.params.boardId,
            content: this.$data.comment,
          });
          this.$data.comment = '';
          break;
        }
        case 'CANCEL': {
          await vm.$router.go(-1);
          break;
        }
        case 'MODIFY': {
          vm.setModifyMode({
            flag: true,
          });
          await vm.$router.push(`/a/class/${this.$route.params.classId}/boardwrite`);
          break;
        }
        case 'DELETEPOST': {
          await vm.deletePost({
            classId: this.$route.params.classId,
            boardId: this.$route.params.boardId,
          });
          await vm.$router.go(-1);
          break;
        }
        case 'DELETECOMMENT': {
          await vm.deleteReply({
            boardId: this.$route.params.boardId,
            replyId: arg,
          });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
        case 'DOWNLOAD': {
          utils.downloadFile(baseUrl + arg, arg2);
          break;
        }
      }
    },
  },
  data() {
    return {
      name: '',
      content: '',
      comment: '',
      fileGuid: 'mock',
      isPostOwner: false,
      jwtUserId: '',
      fileLength: 0,
    };
  },
};
</script>