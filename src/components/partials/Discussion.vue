<template>
  <el-card v-bind:class="{ expand: isVoice }" class="box-card" style="max-width:480px;">
    <el-row style="padding:0;">
      <el-col id="chat-wrap" style="height: 482px; overflow-y: scroll">
        <el-card v-for="d in discuss" class="chat" >
          <div class="chat-head">
            <span>{{d.user.name}}</span>
            <span class="chat-date" style="float:right">{{d.created_at}}</span>
          </div>
          <div v-if="!d.is_audio">
            {{d.content}}
          </div>
          <div v-if="d.is_audio">
            <audio controls :src="d.content">
            </audio>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <hr style="margin-left: -20px; margin-right: -20px">
    <el-row style="padding:0;">
      <el-col>
        <el-form @submit.native.prevent :inline="true" label-width="0px">
          <el-form-item class="chat-msg" >
            <el-input
              type="textarea"
              :rows="2"
              style="width:430px;"
              v-model="msg"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!updating" type="primary" @click="chatSubmit" size="small">입력</el-button>
            <el-button v-if="updating" type="primary" @click="chatSubmit" size="small" disabled>입력</el-button>
            <el-button type="primary" @click="voiceSubmit" size="small">음성</el-button>
          </el-form-item>
          <el-form-item v-if="isVoice">
            <audio controls="" id="audio" :src="streamObjURL"></audio>
            <div>
              <el-button type="primary" @click="voiceRecord" size="small">Record</el-button>
              <el-button type="primary" @click="voicePause" size="small">Pause</el-button>
              <el-button type="primary" @click="voiceUpload" size="small">Upload</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>

</template>


<style scoped>
  .box-card {
    height: 640px;
    margin-left: 120px;
    margin-bottom:30px;
  }
  .box-card.expand {
    height:740px;
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
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import utils from '../../utils';
  import { baseUrl } from '../../services/config';

  export default {
    components: {

    },
    name: 'discussion',
    created() {
      const vm = this;
      const params = {
        lecture_item_id: vm.currentEditingScItem.id,
      };
      vm.$socket.emit('JOIN_DISCUSSION', JSON.stringify(params));
    },
    mounted() {
      const vm = this;
      vm.pre = vm.currentEditingScItem.id;
      vm.isStudent = vm.$route.path.includes('/student/lecture/');
      vm.$nextTick(() => {
        const container = vm.$el.querySelector('#chat-wrap');
        container.scrollTop = container.scrollHeight;
      });
      vm.$socket.on('ARRIVE_NEW_DISCUSSION', (msg) => {
        const jsonMSG = JSON.parse(msg);
        console.log(jsonMSG);
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
    },
    beforeUpdate() {
      const vm = this;
      if (vm.pre !== vm.currentEditingScItem.id) {
        vm.isVoice = false;
        vm.recordedVoice = null;
        vm.streamObjURL = null;
        vm.recordBuffer = [];
        vm.pre = vm.currentEditingScItem.id;
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
        isVoice: false,
        streamObjURL: null,
        recordedVoice: null,
        recordBuffer: [],
      };
    },
    computed: {
      ...mapGetters('scItem', ['currentEditingScItem']),
      ...mapGetters('sc', ['scId']),
      discuss: {
        get() {
          const vm = this;
          const discuss = JSON.parse(JSON.stringify(vm.currentEditingScItem.discussion));
          const dLength = discuss.length;
          for (let i = 0; i < dLength; i += 1) {
            if (!(this.pShare === true ||
              discuss[i].is_teacher === 1 ||
              discuss[i].user_id === utils.getUserIdFromJwt())) {
              delete discuss[i];
            } else {
              discuss[i].created_at = utils.formatDate(new Date(discuss[i].created_at));
            }
            if (discuss[i].is_audio)
              discuss[i].content = baseUrl + discuss[i].content;
          }
          return discuss;
        },
      },
      pShare: {
        get() {
          const vm = this;
          return vm.currentEditingScItem.discussionShare;
        },
      },
    },
    methods: {
      ...mapActions('scItem', [
        'postFile',
      ]),
      ...mapMutations('scItem', ['assignCurrentEditingScItem']),
      formatDate: utils.formatDate,
      chatSubmit() {
        const vm = this;
        const params = {
          lecture_item_id: vm.currentEditingScItem.id,
          user_id: utils.getUserIdFromJwt(),
          content: vm.msg,
          not_save: false,
        };
        vm.$socket.emit('SEND_NEW_DISCUSSION', JSON.stringify(params));
        vm.updating = true;
        vm.msg = '';
      },
      voiceSubmit() {
        const vm = this;
        vm.isVoice = true;
      },
      recordSuccessCallBack(s) {
        const vm = this;
        vm.recordedVoice = new MediaRecorder(s);
        vm.recordedVoice.ondataavailable = function (e) {
          vm.streamObjURL = window.URL.createObjectURL(e.data);
          vm.recordBuffer.push(e.data);
        };
        vm.recordedVoice.start();
      },
      recordFailCallBack() {
      },
      voiceRecord() {
        const vm = this;
        if (navigator.getUserMedia) {
          navigator.getUserMedia({
            audio: true,
          }, vm.recordSuccessCallBack, vm.recordFailCallBack);
        }
      },
      voicePause() {
        const vm = this;
        vm.recordedVoice.stop();
      },
      dataUrlToFile(dataUrl) {
        const binary = atob(dataUrl.split(',')[1]),
        data = [];

        for (let i = 0; i < binary.length; i++)
          data.push(binary.charCodeAt(i));

        return new File([new Uint8Array(data)], 'recorded-audio.mpeg', {
          type: 'audio/mpeg'
        });
      },
      voiceUpload() {
        const vm = this;
        const blob = new Blob(vm.recordBuffer, {
          type: 'audio/mpeg'
        });
        console.log(blob);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function (e) {
          const dataUrl = e.target.result;
          console.log(e);
          const file = vm.dataUrlToFile(dataUrl);
          vm.postFile({
            file: file,
          }).then((r) => {
            console.log(r);
            const discussion = r.data.discussion;
            const params = {
              discussion: discussion,
              not_save: true,
            };
            vm.$socket.emit('SEND_NEW_DISCUSSION', JSON.stringify(params));
            vm.updating = true;
          });
        }
      },
    },
  };
</script>
