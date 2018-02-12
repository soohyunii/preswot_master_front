<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elFrom" label-width="120px">
          <el-form-item label="키워드" prop="keywords">
            <el-tag
              :key="index"
              v-for="(item, index) in scQuestionKeywords"
              closable
              :disable-transitions="false"
              @close="handleClose(item)">
              {{ item.keyword }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </el-form-item>
          <el-form-item label="아이템 제목" prop="scItemTitle">
            <el-input
              placeholder="아이템 제목"
              v-model.lazy="scItemTitle"
              @change="onChange('TITLE')"
            >
            </el-input>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.TITLE" />

          <el-form-item label="아이템 설명" prop="scItemDescription">
            <el-input
              type="textarea"
              :rows="3"
              v-model.lazy="scItemDescription"
              @change="onChange('DESCRIPTION')"
            >
            </el-input>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.DESCRIPTION" />

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ScCommonEditor',
  data() {
    return {
      loading: {
        TITLE: false,
        DESCRIPTION: false,
      },
      inputVisible: false,
      inputValue: '',
    };
  },
  computed: {
    ...mapGetters('teacher', ['currentEditingScItem']),
    input() {
      const res = {};
      const vm = this;
      res.scItemTitle = vm.scItemTitle;
      res.scItemDescription = vm.scItemDescription;
      return res;
    },
    scItemTitle: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return '';
        }
        return item.title;
      },
      set(scItemTitle) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            title: scItemTitle,
          },
        });
      },
    },
    scItemDescription: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return '';
        }
        return item.description;
      },
      set(scItemDescription) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            description: scItemDescription,
          },
        });
      },
    },
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
  },
  methods: {
    ...mapMutations('teacher', ['assignCurrentEditingScItem']),
    ...mapActions('teacher', [
      'putScItem',
    ]),
    async onChange(type) {
      const vm = this;
      try {
        vm.loading[type] = true;
        await vm.putScItem();
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
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
  },
};
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>