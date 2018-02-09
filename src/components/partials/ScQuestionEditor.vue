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
          <i class="el-icon-loading" v-if="loading.TYPE" />

          TODO: 문제 <br />
          TODO: 보기 <br />
          TODO: 답 <br />
          TODO: 답 순서 중요 <br />
          TODO: 배점 <br />
          TODO: 난이도 <br />
          TODO:  <br />

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ScQuestionEditor',
  data() {
    return {
      loading: {
        TYPE: false,
      },
    };
  },
  computed: {
    ...mapGetters('teacher', ['currentEditingScItem']),
    pType: { // * Problem Type
      get() {
        const vm = this;
        // console.log('ptype get', vm.currentEditingScItem, vm.currentEditingScItem.question);
        const q = vm.currentEditingScItem.question;
        return q ? q.type : 0;
        // return 0;
      },
      set(pType) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              type: pType,
            },
          },
        });
      },
    },
  },
  methods: {
    ...mapMutations('teacher', ['assignCurrentEditingScItem']),
    ...mapActions('teacher', ['putQuestion', 'putQuestionType']),
    async onChange(type) {
      const vm = this;
      // eslint-disable-next-line
      console.log('type', type, vm.currentEditingScItem.question.type);
      try {
        vm.loading[type] = true;
        if (type === 'TYPE') {
          await vm.putQuestionType();
        } else {
          await vm.putQuestion();
        }
      } catch (error) {
        vm.$notify({
          title: '저장 실패',
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      } finally {
        vm.loading[type] = false;
      }
    },
  },
};
</script>
