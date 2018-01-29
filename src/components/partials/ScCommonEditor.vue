<template>
  <div>
    <h1>
      Sc Common Editor Template
    </h1>
    <el-row>
      <el-col :span="6">
        <!-- TODO: translate -->
        아이템 제목
      </el-col>
      <el-col :span="18">
        <!-- TODO: translate -->
        <el-input placeholder="제목" v-model="title"></el-input>
      </el-col>
      <el-col :span="6">
        설명
      </el-col>
      <el-col :span="18">

      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ScCommonEditor',
  computed: {
    title() {
      return 'ScTitle';
    },
    description() {
      return 'description';
    },
  },
};
</script>
