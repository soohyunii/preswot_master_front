<template>
  <div id="lc_discussion_editor_wrapper">
    <el-form-item label="토론 주제">
      <el-input v-model="inputTail.content" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
    </el-form-item>

    <el-form-item label="키워드" id="keyword">
      <el-autocomplete
        class="input-new-tag"
        v-model="inputTail.keywordName"
        :fetch-suggestions="querySearch"
        ref="saveTagInput"
        placeholder="키워드"
      />
      <div style="display: inline-block; width: 100px;">
        <el-input id="input_keyword_point" v-model="inputTail.keywordPoint" placeholder="배점"></el-input>
      </div>
      <el-button @click="onClick('ADD_KEYWORD')">추가</el-button><br>
      <div v-for="(item, index) in inputTail.assignedKeywordList" :key="item.keyword" style="display: inline-block; width: 200px;">
        <el-button>{{ item.keyword }} / {{ item.score }}</el-button>
        <el-button @click="onClick('DELETE_KEYWORD',index)" type="danger" style="margin: 0px">X</el-button>
      </div>
    </el-form-item>
    <el-form-item label="난이도" id="difficulty">
      <el-select v-model.number="inputTail.difficulty">
        <el-option
          v-for="level in difficultyList"
          :key="level"
          :label="level"
          :value="level">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'LcDiscussionEditor',
  data() {
    const initialInputBody = {
    };
    const initialInputTail = {
      assignedKeywordList: [],
      difficulty: 3,
    };
    return {
      initialInputBody,
      initialInputTail,
      inputBody: Object.assign({}, initialInputBody),
      inputTail: Object.assign({}, initialInputTail),
      difficultyList: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
      keywordList: [ // TODO: extract it to somewhere else
        {
          value: '키워드1',
          label: '키워드1',
        }, {
          value: '키워드2',
          label: '키워드2',
        }, {
          value: '키워드3',
          label: '키워드3',
        },
      ],
    };
  },
  methods: {
    querySearch(queryString, cb) {
      const vm = this;
      const results = queryString ?
        vm.keywordList.filter(vm.createFilter(queryString)) : vm.keywordList;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) { // eslint-disable-next-line
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    reset() {
      const vm = this;
      vm.inputBody = Object.assign({}, vm.initialInputBody);
      vm.inputTail = Object.assign({}, vm.initialInputTail);
    },
    onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'ADD_KEYWORD': {
          vm.inputTail.assignedKeywordList.push({
            keyword: vm.inputTail.keywordName,
            score: vm.inputTail.keywordPoint,
          });
          vm.inputTail.keywordName = null;
          vm.inputTail.keywordPoint = null;
          break;
        }
        case 'DELETE_KEYWORD': {
          vm.inputTail.assignedKeywordList.splice(arg, 1);
          break;
        }
        default : {
          break;
        }
      }
    },
  },
};
</script>