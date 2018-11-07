<template>
  <div id="material_upload_wrapper">
    <!-- 강의 자료 및 영상 업로드 -->
    <h3>강의 영상 등록</h3>
    <el-input v-model="modifiedLink" style="width: 400px" placeholder="유튜브 공유URL을 입력해주세요.">
      <el-button slot="append" @click="onClick('UPLOAD_KEYWORDS_AND_VIDEO')">등록</el-button>
    </el-input>
    <br><br>
    <iframe v-if="videolink !== ''" width="420" height="315" :src="combinedUrl" frameborder="0"></iframe>
    <br>
    <el-autocomplete
      class="input-new-tag"
      v-model="input.keywordName"
      :fetch-suggestions="querySearch"
      ref="saveTagInput"
      placeholder="키워드"
    />
    <div style="display: inline-block; width: 100px;">
      <el-input id="input_keyword_point" v-model="input.keywordPoint" placeholder="배점"></el-input>
    </div>
    <el-button @click="onClick('ADD_KEYWORD')">추가</el-button><br>
    <div v-for="(item,index) in input.assignedKeywordList" :key="item.keyword" style="display: inline-block;">
      <el-button>{{ item.keyword }} :: {{ item.weight }}점</el-button>
      <el-button @click="onClick('DELETE_KEYWORD',index)" type="danger" style="margin: 0px 10px 0px 0px">X</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getIdFromURL } from 'vue-youtube-embed';
import lectureService from '../../services/lectureService';

export default {
  name: 'MaterialUpload',
  data() {
    return {
      videolink: '',
      modifiedLink: '',
      input: {
        assignedKeywordList: [],
      },
    };
  },
  // 페이지 로딩시 강의자료와 키워드들 불러오기
  async mounted() {
    const vm = this;
    const res2 = await lectureService.getLecture({
      lectureId: vm.$route.params.lectureId,
    });
    if (res2.data.video_link !== null) {
      vm.videolink = res2.data.video_link;
      vm.modifiedLink = res2.data.video_link;
    }
    const res3 = await lectureService.getMainVideoKeyword({
      lectureId: vm.$route.params.lectureId,
    });
    res3.data.forEach((element) => {
      vm.input.assignedKeywordList.push(element);
    });
  },
  computed: {
    ...mapState('keyword', [
      'keywordList',
    ]),
    modifiedKeywordList() {
      const vm = this;
      return vm.keywordList.map(x => ({ value: x.keyword }));
    },
    combinedUrl() {
      const vm = this;
      const id = getIdFromURL(vm.videolink);
      return `https://www.youtube.com/embed/${id}`;
    },
  },
  methods: {
    querySearch(queryString, cb) {
      const vm = this;
      const results = queryString ?
        vm.modifiedKeywordList.filter(vm.createFilter(queryString)) : vm.modifiedKeywordList;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) { // eslint-disable-next-line
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'ADD_KEYWORD': {
          let isEnroll = false;
          vm.keywordList.forEach((element) => {
            if (element.keyword === vm.input.keywordName) {
              isEnroll = true;
            }
          });
          if (isEnroll === false) {
            vm.$notify({
              title: '알림',
              message: '키워드 등록 탭에 등록되지 않은 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            vm.input.keywordName = null;
            vm.input.keywordPoint = null;
            break;
          }
          if (vm.input.assignedKeywordList.map(x => x.keyword).indexOf(vm.input.keywordName) !== -1) { // eslint-disable-line
            vm.$notify({
              title: '알림',
              message: '이미 등록한 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            vm.input.keywordName = null;
            vm.input.keywordPoint = null;
            break;
          }
          vm.input.assignedKeywordList.push({
            keyword: vm.input.keywordName,
            weight: vm.input.keywordPoint,
          });
          vm.input.keywordName = null;
          vm.input.keywordPoint = null;
          break;
        }
        case 'DELETE_KEYWORD': {
          vm.input.assignedKeywordList.splice(arg, 1);
          break;
        }
        case 'UPLOAD_KEYWORDS_AND_VIDEO': {
          // 키워드 있는지 검사
          if (vm.input.assignedKeywordList.length === 0) {
            vm.$notify({
              title: '생성 실패',
              message: '최소 1쌍의 키워드를 반드시 등록해야 합니다.',
              type: 'error',
              duration: 5000,
            });
            return;
          }

          try {
            // 기존 키워드 삭제
            await lectureService.deleteMainVideoKeyword({
              lectureId: vm.$route.params.lectureId,
            });
            // 키워드 업로드
            await lectureService.postMainVideoKeyword({
              lectureId: vm.$route.params.lectureId,
              type: 0,
              data: vm.input.assignedKeywordList,
            });
            // 영상 업로드
            vm.videolink = vm.modifiedLink;
            await lectureService.putLecture({
              lectureId: vm.$route.params.lectureId,
              videoLink: vm.videolink,
            });
            vm.$notify({
              title: '성공',
              message: '영상과 키워드가 성공적으로 등록되었습니다.',
              type: 'success',
              duration: 5000,
            });
          } catch (error) {
            vm.$notify({
              title: '영상 키워드 등록 실패 - 서버 오류입니다.',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
          break;
        }
        default : {
          break;
        }
      }
    },
  },
};
</script>