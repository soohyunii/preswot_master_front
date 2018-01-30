<template>
  <div v-if="!isScEmpty">
    <h1>
      Sc Survey Editor Template
    </h1>
    <el-row>
      <el-col :span="6">
        <!-- TODO: translate -->
        설문 내용
      </el-col>
      <el-col :span="18">
        <el-input type="textarea" :rows="3" placeholder="Java 경험 얼마나?" v-model="survey.description" />
      </el-col>
      <el-col :span="18" :offset="6">
        <template v-for="(item, index, key) in survey.choice">
          <el-input v-model="survey.choice[index]" :key="key">
            <template slot="prepend">#{{ index + 1 }}</template>
            <el-button slot="append" icon="el-icon-close" @click="onClick('deleteSelection', index)"></el-button>
          </el-input>
        </template>
        <el-button type="primary" @click="onClick('addSelection')">(객관식)선지 추가하기 [+]</el-button>
      </el-col>
    </el-row>
    {{ survey }}
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'ScSurveyEditor',
  data() {
    return {
      surveyDescription: '',
      surveyItemIndex: -1,
    };
  },
  computed: {
    ...mapState('teacher', ['sc']),
    ...mapGetters('teacher', ['isScEmpty', 'currentEditingScItem']),
    survey: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) { // eslint-disable-line no-extra-boolean-cast
          return null;
        }
        return item.survey;
      },
      set(survey) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            survey,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'addSelection': {
          vm.currentEditingScItem.survey.choice.push('');
          break;
        }
        case 'deleteSelection': {
          vm.currentEditingScItem.survey.choice.splice(index, 1);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>