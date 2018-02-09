<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form label-width="120px">
          <el-form-item label="문항 유형">
            <el-radio-group
              v-model="pType"
              @change="onChange('TYPE')"
            >
              <el-radio-button :label="0">객관</el-radio-button>
              <el-radio-button :label="1">단답</el-radio-button>
              <el-radio-button :label="2">서술</el-radio-button>
              <el-radio-button :label="3">코딩</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ScQuestionEditor',
  computed: {
    ...mapGetters('teacher', ['currentEditingScItem']),
    pType: { // * Problem Type
      get() {
        const vm = this;
        console.log('ptype get', vm.currentEditingScItem);
        // return vm.currentEditingScItem.question.type;
        return 0;
      },
      set(pType) {

      },
    },
  },
  // methods: {
  //   ...mapActions('teacher', ['test']),
  // },
};
</script>
