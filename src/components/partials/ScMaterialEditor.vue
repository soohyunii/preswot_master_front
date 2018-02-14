<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form ref="elForm" label-width="120px">
          <el-form-item label="키워드">
            <keyword-editor></keyword-editor>
          </el-form-item>
          <el-form-item label="파일 업로드">
            <upload from="ScMaterialEditor"/>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import Upload from './Upload';
import keywordEditor from './keywordEditor';

export default {
  name: 'ScMaterialEditor',
  methods: {
    // ...mapMutations('scItem', ['assignCurrentEditingScItem']),
  },
  components: {
    Upload,
    keywordEditor,
  },
};
</script>
