<template>
  <div id="lc_note_editor_wrapper">
    <el-form-item label="자료 유형">
      <el-radio-group @change="onChangeBody" v-model="inputBody.noteType">
        <el-radio-button label="IMAGE">사진</el-radio-button>
        <el-radio-button label="PDF">PDF</el-radio-button>
        <el-radio-button label="VIDEO">동영상</el-radio-button>
        <el-radio-button label="LINK">링크</el-radio-button>
        <el-radio-button label="YOUTUBE">유튜브</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <template v-if="inputBody.noteType === 'IMAGE'">
      <el-form-item label="사진">
        <el-upload
          class="image-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
          ref="noteUpload">
          <img v-if="imageUrl" :src="imageUrl" class="image">
          <i v-else class="el-icon-plus image-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      {{inputTail.noteFile}}
    </template>

    <template v-if="inputBody.noteType === 'PDF'">
      <el-form-item label="PDF 파일">
        <el-upload
          action="#"
          :auto-upload="false"
          :file-list="initFileList"
          :limit=1
          :before-upload="beforePDFUpload"
          :on-exceed="handleExceed"
          ref="noteUpload">
          <el-button slot="trigger" type="primary">파일 추가</el-button>
        </el-upload>
      </el-form-item>
    </template>

    <template v-if="inputBody.noteType === 'VIDEO'">
      <el-form-item label="동영상">
        <el-upload
          action="#"
          :auto-upload="false"
          :file-list="initFileList"
          :limit=1
          :before-upload="beforeVideoUpload"
          :on-exceed="handleExceed"
          ref="noteUpload">
          <el-button slot="trigger" type="primary">파일 추가</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="재생 구간">
        <el-input v-model="inputTail.videoStart" placeholder="시작시간" style="display: inline-block; width: 100px;"></el-input>
        ~
        <el-input v-model="inputTail.clipEnd" placeholder="종료시간" style="display: inline-block; width: 100px;"></el-input>
      </el-form-item>
    </template>

    <template v-if="inputBody.noteType === 'LINK'">
      <!-- TODO: LINK -->
      <el-form-item label="URL" >
        <el-input v-model="inputTail.link" >
          <el-button type="success" slot="append">미리보기</el-button>
        </el-input>
      </el-form-item>
    </template>

    <template v-if="inputBody.noteType === 'YOUTUBE'">
      <!-- TODO: 유튜브 특정 구간 링크 -->
      <el-form-item label="영상 URL">
        <el-input v-model="inputTail.clip" placeholder="링크" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="재생 구간">
        <el-input v-model="inputTail.videoStart" placeholder="시작시간" style="display: inline-block; width: 100px;"></el-input>
        ~
        <el-input v-model="inputTail.clipEnd" placeholder="종료시간" style="display: inline-block; width: 100px;"></el-input>
      </el-form-item>
    </template>

    <!-- TODO: 키워드 관련 추가
    <el-form-item label="난이도" id="difficulty">
      <el-select v-model.number="inputTail.difficulty">
        <el-option
          v-for="level in difficultyList"
          :key="level"
          :label="level"
          :value="level">
        </el-option>
      </el-select>
    </el-form-item> -->
  </div>
</template>

<script>
export default {
  name: 'LcNoteEditor',
  components: {
  },
  data() {
    const initialInputBody = {
      noteType: null,
    };
    const initialInputTail = {
      // TODO: 키워드
      // assignedKeywordList: [],
      // difficulty: 3,
    };
    return {
      initialInputBody,
      initialInputTail,
      inputBody: Object.assign({}, initialInputBody),
      inputTail: Object.assign({}, initialInputTail),

      imageUrl: '',
      initFileList: [],
      // difficultyList: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
    };
  },
  methods: {
    onChangeBody() {
      const vm = this;
      vm.inputTail = Object.assign({}, vm.initialInputTail);
      this.imageUrl = '';

      if (vm.inputBody.noteType === 'IMAGE' ||
      vm.inputBody.noteType === 'PDF' ||
      vm.inputBody.noteType === 'VIDEO') {
        vm.$set(vm.inputTail, 'noteFile', vm.$refs.noteUpload.uploadFiles);
      }
    },
    reset() {
      const vm = this;
      vm.inputBody = Object.assign({}, vm.initialInputBody);
      vm.inputTail = Object.assign({}, vm.initialInputTail);
    },
    handleImageSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl)
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('JPG 형식의 파일만 업로드 할 수 있습니다.');
      }
      return isJPG;
    },
    beforePDFUpload(file) {
      const isPDF = file.type === 'image/jpeg';
      if (!isPDF) {
        this.$message.error('PDF 형식의 파일만 업로드 할 수 있습니다.');
      }
      return isPDF;
    },
    beforeVideoUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isAVI) {
        this.$message.error('AVI 형식의 파일만 업로드 할 수 있습니다.');
      }
      return isAVI;
    },
    handleExceed() {
      this.$message.warning(
        '강의 아이템당 파일 1개만 업로드 할 수 있습니다.',
      );
    },
  }
};
</script>

<style>
   .image-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .image-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .image {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>