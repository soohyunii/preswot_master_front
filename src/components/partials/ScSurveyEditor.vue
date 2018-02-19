<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form ref="elForm" label-width="120px">
          <el-form-item label="파일 업로드">
            <upload from="ScSurveyEditor"/>
          </el-form-item>

          <el-form-item label="문항 유형">
            <el-radio-group
              v-model="pType"
              @change="onChange('TYPE')"
            >
              <el-radio-button :label="0">객관</el-radio-button>
              <el-radio-button :label="1">서술</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.TYPE" />

          <el-form-item label="설문 제목">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="Java 경험 얼마나?"
              v-model.lazy="pComment"
              @change="onChange('COMMENT')"
            />
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.COMMENT" />

          <template v-if="[0].includes(pType)">
            <el-form-item label="보기" prop="pChoice">
              <el-input
                type="textarea"
                :rows="3"
                v-model.lazy="pChoice"
                @change="onChange('CHOICE')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.CHOICE" />
          </template>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';

import Upload from './Upload';

export default {
  name: 'ScSurveyEditor',
  components: {
    Upload,
  },
  data() {
    return {
      loading: {
        TYPE: false,
        COMMENT: false,
        CHOICE: false,
      },
    };
  },
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    pComment: {
      get() {
        const vm = this;
        const s = vm.currentEditingScItem.comment;
        return s ? s.comment : '';
      },
      set(pComment) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            survey: {
              ...vm.currentEditingScItem.survey,
              comment: pComment,
            },
          },
        });
      },
    },
    pType: { // * Problem Type
      get() {
        const vm = this;
        const s = vm.currentEditingScItem.survey;
        return s ? s.type : 0;
      },
      set(pType) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            survey: {
              ...vm.currentEditingScItem.survey,
              type: pType,
            },
          },
        });
      },
    },
    pChoice: {
      get() {
        const vm = this;
        const s = vm.currentEditingScItem.survey;
        if (!s.choice) {
          return null;
        }
        return s.choice.join(', ');
      },
      set(pChoice) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            survey: {
              ...vm.currentEditingScItem.survey,
              choice: pChoice.split(',')
                .map(value => value.trim())
                .filter(value => value.length !== 0),
            },
          },
        });
      },
    },
  },
  methods: {
    ...mapMutations('scItem', ['assignCurrentEditingScItem']),
    ...mapActions('scItem', ['putSurvey', 'putSurveyType']),
    async onChange(type) {
      const vm = this;
      try {
        vm.loading[type] = true;
        await vm.putSurvey();
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