<template>
  <div id="lc_note_editor_wrapper">
    <el-form-item label="자료 유형">
      <el-radio-group @change="onChangeBody" v-model="inputBody.noteType">
        <el-radio-button label="IMAGE">사진</el-radio-button>
        <el-radio-button label="DOCS">문서</el-radio-button>
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

    <template v-if="inputBody.noteType === 'DOCS'">
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
        <el-input v-model="inputTail.url" style="width: 400px">
          <el-button v-if="previewFLAG === false" type="success" slot="append" @click="onClick('PREVIEW')">확인</el-button>
          <el-button v-if="previewFLAG === true" type="success" slot="append" @click="onClick('PREVIEW')">닫기</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="미리보기" v-if="previewFLAG === true">
        <link-prevue v-show="previewFLAG" :url="inputTail.url" :showButton="false"></link-prevue>
      </el-form-item>
    </template>

    <template v-if="inputBody.noteType === 'YOUTUBE'">
      <!-- TODO: 유튜브 특정 구간 링크 -->
      <el-form-item label="URL">
        <el-input v-model="inputTail.url" style="width: 400px">
          <el-button v-if="previewFLAG === false" type="success" slot="append" @click="onClick('PREVIEW')">확인</el-button>
          <el-button v-if="previewFLAG === true" type="success" slot="append" @click="onClick('PREVIEW')">닫기</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="재생 구간">
        <el-input v-model="inputTail.videoStart" placeholder="시작시간" style="display: inline-block; width: 100px;"></el-input>
        ~
        <el-input v-model="inputTail.videoEnd" placeholder="종료시간" style="display: inline-block; width: 100px;"></el-input>
      </el-form-item>
      <el-form-item label="미리보기" v-if="previewFLAG === true">
        <iframe v-if="inputTail.url !== undefined" width="420" height="315" :src="combinedUrl" frameborder="0"></iframe>
      </el-form-item>
    </template>

  </div>
</template>

<script>
import { getIdFromURL } from 'vue-youtube-embed';
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
    combinedUrl() {
      const vm = this;
      const id = getIdFromURL(vm.inputTail.url);
      return `https://www.youtube.com/embed/${id}?start=${vm.inputTail.videoStart}&end=${vm.inputTail.videoEnd}`;
    },
  },
  methods: {
    onChangeBody() {
      const vm = this;
      vm.inputTail = Object.assign({}, vm.initialInputTail);

      if (vm.inputBody.noteType === 'IMAGE' || vm.inputBody.noteType === 'DOCS') {
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
    onClick(type) {
      const vm = this;
      switch (type) {
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
