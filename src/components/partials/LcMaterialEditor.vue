<template>
  <div id="lc_material_editor_wrapper">
    <el-form-item label="자료 유형">
      <el-radio-group v-model="inputBody.materialType">
        <el-radio-button label="FILE">파일</el-radio-button>
        <el-radio-button label="LINK">링크</el-radio-button>
        <el-radio-button label="YOUTUBE">유튜브</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <template v-if="inputBody.marterialType === 'FILE'">
      <el-form-item label="강의 자료">
        <material-upload />
      </el-form-item>
    </template>
    <template v-if="inputBody.marterialType === 'LINK'">
      <!-- TODO: LINK -->
       <!-- <el-form-item label="URL">
      <el-input v-model="inputTail.link">
        <el-button type="success" slot="append">미리보기</el-button>
      </el-input>
    </el-form-item> -->
    </template>
    <template v-if="inputBody.marterialType === 'YOUTUBE'">
      <!-- TODO: 유튜브 특정 구간 링크 -->
      <!-- <el-form-item label="재생 구간" id="clip_time">
      <el-input v-model="inputTail.clipStart" placeholder="시작시간" style="display: inline-block; width: 100px;"></el-input>
        ~
      <el-input v-model="inputTail.clipEnd" placeholder="종료시간" style="display: inline-block; width: 100px;"></el-input>
    </el-form-item>
    <el-form-item label="영상URL" id="clip_url">
      <el-input v-model="inputTail.clip" placeholder="링크"></el-input>
    </el-form-item> -->
    </template>
  </div>
</template>

<script>
import MaterialUpload from '../partials/MaterialUpload';

export default {
  name: 'LcMaterialEditor',
  components: {
    MaterialUpload,
  },
  data() {
    const initialInputBody = {
      marterialType: null,
    };
    const initialInputTail = {
    };
    return {
      initialInputBody,
      initialInputTail,
      inputBody: Object.assign({}, initialInputBody),
      inputTail: Object.assign({}, initialInputTail),
    };
  },
  methods: {
    reset() {
      const vm = this;
      vm.inputBody = Object.assign({}, vm.initialInputBody);
      vm.inputTail = Object.assign({}, vm.initialInputTail);
    },
  },
};
</script>