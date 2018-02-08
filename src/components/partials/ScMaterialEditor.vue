<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form ref="elForm" label-width="120px">
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

export default {
  name: 'ScMaterialEditor',
  methods: {
    // ...mapMutations('teacher', ['assignCurrentEditingScItem']),
  },
  components: {
    Upload,
  },
};
</script>
