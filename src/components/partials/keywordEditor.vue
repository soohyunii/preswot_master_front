<template>
  <div>
    <el-tag
      :key="index"
      v-for="(item, index) in scItemKeywords"
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
            min="1"
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
    ...mapGetters('scItem', ['currentEditingScItem']),
    scItemKeywords: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return [];
        }
        return item.itemKeywords;
      },
      set(scItemKeywords) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            itemKeywords: scItemKeywords,
          },
        });
      },
    },
    nodes: {
      get() {
        const vm = this;
        return vm.$store.state.sc.nodes;
      },
      set(nodes) {
        const vm = this;
        vm.updateNodes({ nodes }); // FIXME: 이거 mapMutation으로 안받아오는데..?
      },
    },
  },
  methods: {
    ...mapMutations('scItem', [
      'assignCurrentEditingScItem',
      'pushItemKeyword',
      'updateItemScore',
    ]),
    ...mapActions('scItem', [
      'putScItem',
      'postItemKeywords',
      'deleteItemKeywords',
    ]),
    handleClose(item) {
      const vm = this;
      const itemKeywords = vm.currentEditingScItem.itemKeywords;
      itemKeywords.splice(itemKeywords.findIndex(k => k.keyword === item.keyword), 1);
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
      if (!nodesNames.includes(inputValue) && inputValue) {
        // TODO: transalte
        vm.$notify({
          title: 'Empty',
          message: 'Node에 존재하는 값으로 좀..',
          type: 'warning',
        });
        return;
      } else if (vm.currentEditingScItem.itemKeywords.findIndex(
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
        await vm.pushItemKeyword({
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
      let scoreSum = 0;
      item.itemKeywords.forEach((keyword) => {
        scoreSum += keyword.score;
      });
      let id = null;
      let itemScore = 0;
      switch (item.type) {
        case '문항': {
          id = item.question.id;
          itemScore = item.question.score;
          break;
        }
        case '강의자료': {
          id = item.material.id;
          itemScore = item.material.score;
          break;
        }
        default: {
          throw new Error('not defined type', item.type);
        }
      }
      vm.updateItemScore({ score: scoreSum });
      await vm.deleteItemKeywords({ id }); // TODO: try catch
      vm.postItemKeywords({ id }); // TODO: try catch
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
