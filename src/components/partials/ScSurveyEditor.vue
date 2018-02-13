<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="survey" ref="elForm" label-width="120px">
          <el-form-item label="파일 업로드">
            <upload from="ScSurveyEditor"/>
          </el-form-item>

          <el-form-item label="설문 제목">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="Java 경험 얼마나?"
              v-model="survey.description"
            />
          </el-form-item>

          <el-form-item label="설문 문항">
            <template v-for="(item, index, key) in survey.choice">
              <el-input v-model="survey.choice[index]" :key="key">
                <template slot="prepend">#{{ index + 1 }}</template>
                <el-button slot="append" icon="el-icon-close" @click="onClick('deleteSelection', index)"></el-button>
              </el-input>
            </template>
            <br v-if="survey.choice.length" /> <br v-if="survey.choice.length" />
            <el-button type="primary" @click="onClick('addSelection')">(객관식) 선지 추가하기 [+]</el-button>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';

import Upload from './Upload';

export default {
  name: 'ScSurveyEditor',
  components: {
    Upload,
  },
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
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            survey,
          },
        });
      },
    },
  },
  methods: {
    ...mapMutations('teacher', ['assignCurrentEditingScItem']),
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