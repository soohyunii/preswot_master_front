<template>
  <div v-if="!isScEmpty">
    <h1>
      Sc Survey Editor Template
    </h1>
    <template v-for="(items, index, key) in currentEditingScItem.surveyList">
        <!-- 주관식 문항 -->
        <div v-if="items.type === 'subjectiveItem'" :key="key">
          설문 #{{ index + 1 }} (주관식)
          <!-- surveyItem: 설문 문항 리스트 -->
          <template v-for="(item, itemIndex, key) in items.surveyItem">
            <el-row :key="key">
              <el-col :offset="6" :span="18">
                <el-input type="textarea" :rows="3" placeholder="Java 경험 얼마나?" v-model="surveyList[index].surveyItem[itemIndex]" />
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="18" :offset="6">
              <el-button type="primary" @click="onClick('addSubjectiveQuestion', index)">설문 문항 추가</el-button>
            </el-col>
          </el-row>
        </div>
        <!-- 객관식 문항 -->
        <div v-else :key="key">
          설문 #{{ index + 1 }} (객관식)
          <template v-for="(item, itemIndex, key) in items.surveyItem">
            <el-row :key="key">
              <el-col :offset="6" :span="18">
                <el-input type="textarea" :rows="3" placeholder="Java 경험 얼마나?" v-model="surveyList[index].surveyItem[itemIndex].description" />
              </el-col>
            </el-row>
            <!-- choices: 객관식 문항의 선지 리스트 -->
            <template v-for="(question, questionIndex, key) in item.choices">
              <el-row :key="key">
                <el-col :offset="6" :span="18">
                  <el-input placeholder="Please input" v-model="surveyList[index].surveyItem[itemIndex].choices[questionIndex]">
                    <template slot="prepend">#{{ questionIndex + 1 }}</template>
                  </el-input>
                </el-col>
              </el-row>
            </template>
            <el-row :key="key">
              <el-col :span="18" :offset="6">
                <el-button type="primary" @click="onClick('addChoice', index, itemIndex)">선지 추가</el-button>
              </el-col>
            </el-row>
            <br :key="key" />
          </template>
          <el-row>
            <el-col :span="18" :offset="6">
              <el-button type="primary" @click="onClick('addObjectiveQuestion', index)">설문 문항 추가</el-button>
            </el-col>
          </el-row>
        </div>
    </template>
    <br />
    <el-row>
      <el-col :span="6">
        <!-- TODO: translate -->
        설문 추가
      </el-col>
      <el-col :span="18">
          <el-button type="primary" @click="onClick('objectiveItem')">객관식</el-button>
          <el-button type="primary" @click="onClick('subjectiveItem')">주관식<i class="el-icon-right"></i></el-button>
      </el-col>
    </el-row>
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
    surveyList: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.surveyList || [];
        }
        return [];
      },
      set(surveyList) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            surveyList,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
  },
  methods: {
    ...mapMutations('teacher', ['updateSurveyList']),
    onClick(type, index1, index2) {
      const vm = this;
      switch (type) {
        case 'objectiveItem': {
          vm.updateSurveyList({ type });
          break;
        }
        case 'subjectiveItem': {
          vm.updateSurveyList({ type });
          break;
        }
        case 'addSubjectiveQuestion': {
          vm.surveyList[index1].surveyItem.push('');
          break;
        }
        case 'addObjectiveQuestion': {
          vm.surveyList[index1].surveyItem.push({ description: '', choices: [''] });
          break;
        }
        case 'addChoice': {
          vm.surveyList[index1].surveyItem[index2].choices.push('');
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