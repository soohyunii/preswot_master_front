<template>
  <div>
    <h1>Lecture Scenario Material Editor template</h1>
    <h2>내용</h2>
      <el-row>
        <el-col :span="6">
          파일 업로드
        </el-col>
        <el-col :span="18">
          TODO: 업로드 [ + ]
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          설명
        </el-col>
        <el-col :span="18">
          <el-input
            type="textarea"
            :rows="3"
            :value="value"
            ref="elInput"
            @input="update()"
          >
            <!-- v-model="description" -->
          </el-input>
        </el-col>
      </el-row>
  </div>
</template>

<script>
/**
 * @description 강의자료 에디터
 */
export default {
  name: 'LectureScenarioMaterialEditor',
  props: ['value'],
  methods: {
    update() {
      const vm = this;
      vm.$emit('input', vm.$refs.elInput.$el.lastChild.value);
    },
  },
};
</script>
