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
          :on-change="handleChange"
          :on-exceed="handleExceed"
          list-type="picture"
          ref="noteUpload">
          <el-button slot="trigger" type="primary">파일 추가</el-button>
          <span slot="tip" class="el-upload__tip"> 사진(jpg, png, gif) 파일만 가능합니다.</span>
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
          :on-change="handleChange"
          :on-exceed="handleExceed"
          ref="noteUpload">
          <el-button slot="trigger" type="primary">파일 추가</el-button>
          <span slot="tip" class="el-upload__tip"> 문서(pdf, docx), PPT(pptx) 파일만 가능합니다.</span>
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
        <!-- FIXME: link-prevue npm모듈 사용해서 링크 미리보기 확인합니다.
                    특정 링크들은 한글이 깨져서 나옵니다. 수정가능하면 좋을 것 같습니다. -->
        <link-prevue v-show="previewFLAG" :url="inputTail.url" :showButton="false"></link-prevue>
      </el-form-item>
    </template>

    <template v-if="inputBody.noteType === 'YOUTUBE'">
      <el-form-item label="URL">
        <el-input v-model="inputTail.url" style="width: 400px">
          <el-button v-if="previewFLAG === false" type="success" slot="append" @click="onClick('PREVIEW')">확인</el-button>
          <el-button v-if="previewFLAG === true" type="success" slot="append" @click="onClick('PREVIEW')">닫기</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="재생 구간">
        <el-time-picker
          is-range
          v-model="inputTail.interval"
          range-separator="To"
          start-placeholder="Start time"
          end-placeholder="End time">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="미리보기" v-if="previewFLAG === true">
        <!-- 종료시간 설정을 위해서 iframe 태그 사용했습니다. url은 유튜브 공유 링크를 입력받는 것이 좋습니다. -->
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
      const start = (3600 * vm.inputTail.interval[0].getHours()) +
        (60 * vm.inputTail.interval[0].getMinutes()) + vm.inputTail.interval[0].getSeconds();
      const end = (3600 * vm.inputTail.interval[1].getHours()) +
        (60 * vm.inputTail.interval[1].getMinutes()) + vm.inputTail.interval[1].getSeconds();
      return `https://www.youtube.com/embed/${id}?start=${start}&end=${end}`;
    },
  },
  methods: {
    onChangeBody() {
      const vm = this;

      if (vm.inputBody.noteType === 'IMAGE' || vm.inputBody.noteType === 'DOCS') {
        vm.$refs.noteUpload.uploadFiles = [];
        vm.$set(vm.inputTail, 'file', vm.$refs.noteUpload.uploadFiles);
      }

      if (vm.inputBody.noteType === 'LINK') {
        vm.previewFLAG = false;
      }

      if (vm.inputBody.noteType === 'YOUTUBE') {
        vm.previewFLAG = false;
        vm.$set(vm.inputTail, 'interval', [new Date(2018, 8, 15, 0, 0, 0), new Date(2018, 8, 15, 0, 59, 59)]);
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
    handleChange(file, filelist) {
      const vm = this;
      if (vm.inputBody.noteType === 'IMAGE') {
        if (!(['image/gif', 'image/png', 'image/jpeg'].includes(file.raw.type))) {
          vm.$message.warning('업로드 가능한 파일 형식이 아닙니다.');
          vm.initialFileList = filelist.slice(0, -1);
          vm.inputTail.file = filelist.slice(0, -1);
        }
      }
      if (vm.inputBody.noteType === 'DOCS') {
        if (!(['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/pdf'].includes(file.raw.type))) {
          vm.$message.warning('업로드 가능한 파일 형식이 아닙니다.');
          vm.initialFileList = filelist.slice(0, -1);
          vm.inputTail.file = filelist.slice(0, -1);
        }
      }
    },
  },
};
</script>
