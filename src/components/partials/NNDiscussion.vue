<template>
<div>
  <p> {{ discussionName }} </p>
  <p> {{ discussionTopic }} </p>
  <el-card class="box-card" style="max-width:480px;">  
    <el-row style="padding:0;">
      <el-col id="chat-wrap" style="height: 270px; overflow-y: scroll">
        <el-card v-for="(d, index) in discuss" :key="index" class="chat">
          <div class="chat-head">
            <span>{{d.user.name}}</span>
            <span class="chat-date" style="float:right">{{d.created_at}}</span>
          </div>
          <div>
            {{d.content}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <hr style="margin-left: -20px; margin-right: -20px">
    <el-row style="padding:0;">
      <el-col>
        <el-form @submit.native.prevent :inline="true" label-width="0px" class="chat-msg-box">
          <el-form-item class="chat-msg" >
            <el-input
              type="textarea"
              :rows="2"
              style="width:352px;"
              v-model="msg"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!updating" type="primary" @click="chatSubmit" size="small">입력</el-button>
            <el-button v-if="updating" type="primary" @click="chatSubmit" size="small" disabled>입력</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>


<style scoped>
  .box-card {
    /*height: 330px;*/
    height: 400px;
    margin:20px 35px 0 35px;

  }
  .chat-msg {
    margin-bottom: 0;
  }
  .chat {
    margin: 5px 5px 5px 0;
  }
  .chat-date {
    float: right;
    color: #aaaaaa;
  }
  .chat-head {
    margin-bottom: 5px;
  }


</style>


<script>
  import { mapGetters, mapMutations } from 'vuex';
  import utils from '../../utils';
  import discussionService from '../../services/discussionService';
  import lectureItemService from '../../services/lectureItemService';

  export default {
    components: {

    },
    name: 'discussion',
    async created() {
      const vm = this;
      const params = {
        lecture_item_id: vm.lectureItemId,
      };
      const res = await lectureItemService.getLectureItem({
        lectureItemId: vm.lectureItemId,
      });
      // console.log('@disc ', res.data.discussion_info.topic);
      vm.discussionName = res.data.name;
      vm.discussionTopic = res.data.discussion_info.topic;
      vm.$socket.emit('JOIN_DISCUSSION', JSON.stringify(params));
    },
    async mounted() {
      const vm = this;
      vm.pre = vm.lectureItemId;
      vm.isStudent = vm.$route.path.includes('/student/lecture/');
      /* 이 부분에서 에러가 발생하여 임시로 주석 처리
      vm.$nextTick(() => {
        const container = vm.$el.querySelector('#chat-wrap');
        container.scrollTop = container.scrollHeight;
      });
      */
      vm.$socket.on('ARRIVE_NEW_DISCUSSION', (msg) => {
        const jsonMSG = JSON.parse(msg);
        if (this.pShare === true ||
          jsonMSG.is_teacher === 1 ||
          jsonMSG.user_id === utils.getUserIdFromJwt()) {
          jsonMSG.created_at = utils.formatDate(new Date(jsonMSG.created_at));
          vm.discuss.push(jsonMSG);

          if (jsonMSG.user_id === utils.getUserIdFromJwt()) {
            vm.updating = false;
          }
          vm.$forceUpdate();
        }
      });
      const res = await discussionService.getDiscussion({ id: vm.lectureItemId });
      const discuss = JSON.parse(JSON.stringify(res.data.discussion));
      const dLength = discuss.length;
      for (let i = 0; i < dLength; i += 1) {
        if (!(this.pShare === true ||
          discuss[i].is_teacher === 1 ||
          discuss[i].user_id === utils.getUserIdFromJwt())) {
          delete discuss[i];
        } else {
          discuss[i].created_at = utils.formatDate(new Date(discuss[i].created_at));
        }
      }
      vm.discuss = discuss;
    },
    beforeUpdate() {
      const vm = this;
      if (vm.pre !== vm.lectureItemId) {
        vm.pre = vm.lectureItemId;
        vm.$forceUpdate();
      }
    },
    updated() {
      const vm = this;
      vm.$nextTick(() => {
        const container = vm.$el.querySelector('#chat-wrap');
        container.scrollTop = container.scrollHeight;
      });
    },
    data() {
      return {
        msg: '',
        isStudent: true,
        updating: false,
        pre: -1,
        discuss: [],
        discussionName: '',
        discussionTopic: '',
      };
    },
    computed: {
      ...mapGetters('scItem', ['currentEditingScItem']),
      ...mapGetters('sc', ['scId']),
      pShare: {
        get() {
          // const vm = this;
          // return vm.currentEditingScItem.discussionShare;
          return true;
        },
      },
    },
    methods: {
      ...mapMutations('scItem', ['assignCurrentEditingScItem']),
      formatDate: utils.formatDate,
      chatSubmit() {
        const vm = this;
        const params = {
          lecture_item_id: vm.lectureItemId,
          user_id: utils.getUserIdFromJwt(),
          content: vm.msg,
        };
        vm.$socket.emit('SEND_NEW_DISCUSSION', JSON.stringify(params));
        vm.updating = true;
        vm.msg = '';
      },
    },
    props: ['lectureItemId'],
  };
</script>
