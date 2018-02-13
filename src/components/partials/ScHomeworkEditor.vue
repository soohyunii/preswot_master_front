<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form ref="elForm" label-width="120px">
          <el-form-item label="파일 업로드">
            <upload from="ScHomeworkEditor"/>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import Upload from './Upload';

export default {
  name: 'ScHomeworkEditor',
  components: {
    Upload,
  },
};
</script>
