<template>
  <div>
    <el-tag
      :key="index"
      v-for="(item, index) in scQuestionKeywords"
      closable
      :disable-transitions="false"
      @close="handleClose(item)">
      {{ item.keyword }} ({{ item.score }})
    </el-tag>
    <el-row>
      <el-col>
        <div v-if="inputVisible">
          <el-autocomplete
            class="input-new-tag"
            v-model="inputValue"
            :fetch-suggestions="querySearch"
            ref="saveTagInput"
            placeholder="키워드"
            size="mini"
          />
          <el-input
            class="input-new-tag"
            v-model.number="inputScore"
            type="number"
            placeholder="배점"
            size="mini"
          />
          <el-button class="button-new-tag" size="small" @click="handleInputConfirm">키워드 추가</el-button>
        </div>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">키워드 추가</el-button>
        <el-button @click="save" type="primary" size="small">
          키워드 저장
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'keywordEditor',
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      inputScore: '',
    };
  },
  computed: {
    ...mapGetters('teacher', ['currentEditingScItem']),
    scQuestionKeywords: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return [];
        }
        return item.questionKeywords;
      },
      set(scQuestionKeywords) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            questionKeywords: scQuestionKeywords,
          },
        });
      },
    },
    nodes: {
      get() {
        const vm = this;
        return vm.$store.state.teacher.nodes;
      },
      set(nodes) {
        const vm = this;
        vm.updateNodes({ nodes });
      },
    },
  },
  methods: {
    ...mapMutations('teacher', [
      'assignCurrentEditingScItem',
      'pushQuestionKeyword',
    ]),
    ...mapActions('teacher', [
      'putScItem',
      'postQuestionKeyword',
      'deleteQuestionKeywords',
    ]),
    handleClose(item) {
      const vm = this;
      const questionKeywords = vm.currentEditingScItem.questionKeywords;
      questionKeywords.splice(questionKeywords.findIndex(k => k.keyword === item.keyword), 1);
    },
    async showInput() {
      const vm = this;
      vm.inputVisible = true;
      await vm.$nextTick();
      vm.$refs.saveTagInput.$refs.input.focus();
    },
    async handleInputConfirm() {
      const vm = this;
      const inputValue = vm.inputValue;
      const inputScore = vm.inputScore;
      const nodesNames = [];
      for (let i = 0; i < vm.nodes.length; i += 1) {
        nodesNames.push(vm.nodes[i].name);
      }
      if (!nodesNames.includes(inputValue)) {
        // TODO: transalte
        vm.$notify({
          title: 'Empty',
          message: 'Node에 존재하는 값으로 좀..',
          type: 'warning',
        });
        return;
      } else if (vm.currentEditingScItem.questionKeywords.findIndex(
        k => k.keyword === inputValue) !== -1) {
        // TODO: transalte
        vm.$notify({
          title: 'Empty',
          message: 'keyword already exists',
          type: 'warning',
        });
        return;
      }
      if (inputValue && inputScore) {
        await vm.pushQuestionKeyword({
          keyword: inputValue,
          score: inputScore,
        });
      }
      vm.inputVisible = false;
      vm.inputValue = '';
      vm.inputScore = '';
    },
    async save() {
      const vm = this;
      const item = vm.currentEditingScItem;
      const questionId = item.question.id;
      let scoreSum = 0;
      item.questionKeywords.forEach((keyword) => {
        scoreSum += keyword.score;
      });
      if (scoreSum !== item.question.score) {
        // TODO: transalte
        vm.$notify({
          title: '406',
          message: 'score sum invalid',
          type: 'warning',
        });
        return;
      }
      await vm.deleteQuestionKeywords({ questionId }); // TODO: try catch
      vm.postQuestionKeyword({ questionId }); // TODO: try catch
    },
    querySearch(queryString, cb) {
      const vm = this;
      const links = this.nodes;
      const results = queryString ? links.filter(vm.createFilter(queryString)) : links;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) { // eslint-disable-next-line
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
  },
};
</script>


<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
</style>