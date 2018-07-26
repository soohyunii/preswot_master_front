<template>
  <div id="lc_note_editor_wrapper">
    <el-form-item label="자료 유형">
      <el-radio-group @change="onChangeBody" v-model="inputBody.noteType">
        <el-radio-button label="IMAGE">사진</el-radio-button>
        <el-radio-button label="PDF">PDF</el-radio-button>
        <el-radio-button label="LINK">링크</el-radio-button>
        <el-radio-button label="YOUTUBE">유튜브</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <template v-if="inputBody.noteType === 'IMAGE'">
      <el-form-item label="사진">
        <el-upload
          action="#"
          :auto-upload="false"
          :file-list="initialFileList"
          :limit=1
          :on-exceed="handleExceed"
          list-type="picture"
          ref=noteUpload>
          <el-button slot="trigger" type="primary">파일 추가</el-button>
        </el-upload>
      </el-form-item>
    </template>

    <template v-if="inputBody.noteType === 'PDF'">
      <el-form-item label="문서">
        <el-upload
          action="#"
          :auto-upload="false"
          :file-list="initialFileList"
          :limit=1
          :on-exceed="handleExceed"
          list-type="picture"
          ref=noteUpload>
          <el-button slot="trigger" type="primary">파일 추가</el-button>
        </el-upload>
      </el-form-item>
    </template>

    <template v-if="inputBody.noteType === 'LINK'">
      <el-form-item label="URL" >
        <el-input v-model="inputTail.link" style="width: 400px">
          <el-button v-if="previewFLAG === false" type="success" slot="append" @click="onClick('PREVIEW')">확인</el-button>
          <el-button v-if="previewFLAG === true" type="success" slot="append" @click="onClick('PREVIEW')">닫기</el-button>
        </el-input>
        <link-prevue v-show="previewFLAG" :url="inputTail.link" :showButton="false"></link-prevue>
      </el-form-item>
    </template>

    <template v-if="inputBody.noteType === 'YOUTUBE'">
      <!-- TODO: 유튜브 특정 구간 링크 -->
      <el-form-item label="영상 URL">
        <el-input v-model="inputTail.link" placeholder="링크" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="재생 구간">
        <el-input v-model="inputTail.videoStart" placeholder="시작시간" style="display: inline-block; width: 100px;"></el-input>
        ~
        <el-input v-model="inputTail.videoEnd" placeholder="종료시간" style="display: inline-block; width: 100px;"></el-input>
      </el-form-item>
    </template>

    <!-- TODO: 키워드 관련 추가 -->
    <el-form-item label="키워드" id="keyword">
      <el-autocomplete
        class="input-new-tag"
        v-model="inputTail.keywordName"
        :fetch-suggestions="querySearch"
        ref="saveTagInput"
        placeholder="키워드"
      />
      <div style="display: inline-block; width: 100px;">
        <el-input id="input_keyword_point" v-model="inputTail.keywordPoint" placeholder="배점"></el-input>
      </div>
      <el-button @click="onClick('ADD_KEYWORD')">추가</el-button><br>
      <div v-for="(item,index) in inputTail.assignedKeywordList" :key="item.keyword" style="display: inline-block; width: 200px;">
        <el-button>{{ item.keyword }} / {{ item.score }}</el-button>
        <el-button @click="onClick('DELETE_KEYWORD',index)" type="danger" style="margin: 0px">X</el-button>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LinkPrevue from 'link-prevue';

export default {
  name: 'LcNoteEditor',
  components: {
    LinkPrevue,
  },
  data() {
    const initialInputBody = {
      noteType: null,
    };
    const initialInputTail = {
      assignedKeywordList: [],
    };

    return {
      initialInputBody,
      initialInputTail,
      inputBody: Object.assign({}, initialInputBody),
      inputTail: Object.assign({}, initialInputTail),
      initialFileList: [],
      previewFLAG: false,
    };
  },
  computed: {
    ...mapState('keyword', [
      'keywordList',
    ]),
    modifiedKeywordList() {
      const vm = this;
      return vm.keywordList.map(x => ({ value: x }));
    },
  },
  methods: {
    onChangeBody() {
      const vm = this;
      vm.inputTail = Object.assign({}, vm.initialInputTail);

      if (vm.inputBody.noteType === 'IMAGE' || vm.inputBody.noteType === 'PDF') {
        vm.$refs.noteUpload.uploadFiles = [];
        vm.$set(vm.inputTail, 'file', vm.$refs.noteUpload.uploadFiles);
      }

      if (vm.inputBody.noteType === 'LINK') {
        vm.previewFLAG = false;
      }
    },
    reset() {
      const vm = this;
      vm.inputBody = Object.assign({}, vm.initialInputBody);
      vm.inputTail = Object.assign({}, vm.initialInputTail);
    },
    querySearch(queryString, cb) {
      const vm = this;
      const results = queryString ?
        vm.modifiedKeywordList.filter(vm.createFilter(queryString)) : vm.modifiedKeywordList;
      cb(results);
    },
    createFilter(queryString) { // eslint-disable-next-line
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'ADD_KEYWORD': {
          if (vm.keywordList.indexOf(vm.inputTail.keywordName) === -1) {
            vm.$notify({
              title: '알림',
              message: '키워드 등록 탭에 등록되지 않은 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            break;
          }
          if (vm.inputTail.assignedKeywordList.map(x => x.keyword).indexOf(vm.inputTail.keywordName) !== -1) { // eslint-disable-line
            vm.$notify({
              title: '알림',
              message: '이미 등록한 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            break;
          }
          vm.inputTail.assignedKeywordList.push({
            keyword: vm.inputTail.keywordName,
            score: vm.inputTail.keywordPoint,
          });
          vm.inputTail.keywordName = null;
          vm.inputTail.keywordPoint = null;
          break;
        }
        case 'DELETE_KEYWORD': {
          vm.inputTail.assignedKeywordList.splice(arg, 1);
          break;
        }
        case 'PREVIEW': {
          if (vm.previewFLAG === true) {
            vm.previewFLAG = false;
          } else {
            vm.previewFLAG = true;
          }
          break;
        }
        default : {
          break;
        }
      }
    },
    handleExceed() {
      this.$message.warning(
        '강의 아이템당 파일 1개만 업로드 할 수 있습니다.',
      );
    },
  },
};
</script>
