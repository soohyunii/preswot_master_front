<template>
  <div id="lecture_keywords_editor_wrapper">
    lecture keywords editor template
    <!-- {{ keywordList }} -->
    <draggable element="div" v-model="keywordList" :options="dragOptions">
      <transition-group type="transition">
        <el-tag class="tag" type="primary" v-for="k in keywordList" :key="k" closable @close="onClick('DELETE_TAG', k)">{{ k }}</el-tag>
      </transition-group>
    </draggable>

    <el-form @submit.native.prevent :model="input" :rules="rules" ref="elForm" label-width="125px" style="max-width: 400px;">
      <el-form-item label="키워드 입력" prop="keyword">
        <el-input v-model="input.keyword" @keydown.enter.native="onClick('ADD')">
          <el-button type="success" slot="append" icon="el-icon-plus" @click="onClick('ADD')"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import deepCopy from 'deep-copy';
import draggable from 'vuedraggable';
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'LectureKeywordsEditor',
  components: {
    draggable,
  },
  data() {
    return {
      input: {
        keyword: '',
      },
      rules: {
        keyword: {
          required: true,
          message: '한 글자 이상 키워드를 입력해주세요.',
          trigger: 'change',
        },
      },
      dragOptions: {
        animation: 0,
        group: 'description',
        disable: false,
      },
    };
  },
  computed: {
    ...mapState('lc', [
      'addedKeywordList',
    ]),
    ...mapGetters('lc', [
      'isKeywordDuplicated',
    ]),
    keywordList: {
      get() {
        const res = [];
        // JAVA에서의 List.addAll()
        Array.prototype.push.apply(res, this.$store.state.lc.keywordList);
        Array.prototype.push.apply(res, this.$store.state.lc.movedKeywordList);
        Array.prototype.push.apply(res, this.$store.state.lc.addedKeywordList);
        return res;
      },
      set(/* value */) {
        // NOTE: 여기서는 다른곳에서 다 해줘서 해줄 필요가 없다?
        // 그래도 set 함수가 없으면 vue가 꼬장부려서 놔둠
        // console.log('lecture keyword set value', value); // eslint-disable-line
      },
    },
  },
  methods: {
    ...mapMutations('lc', [
      'updateMovedKeywordList',
      'updateAddedKeywordList',
    ]),
    ...mapActions('lc', [
      'deleteKeyword',
    ]),
    onClick(type, payload) {
      switch (type) {
        case 'ADD': {
          this.$refs.elForm.validate(((valid) => {
            if (valid) {
              const keyword = this.input.keyword.trim();
              if (keyword.length === 0) {
                // 존나 이유를 모르겠는데 가끔 keydown이 두번씩 들어옴 그걸 validate에서 거르지도 못함 병신임
                return;
              }
              if (this.isKeywordDuplicated(keyword)) {
                // TODO: notify user the keyword is duplicated

                this.$refs.elForm.resetFields();
                return;
              }
              const newAddedKeywordList = deepCopy(this.addedKeywordList);
              newAddedKeywordList.push(keyword);
              this.updateAddedKeywordList({
                addedKeywordList: newAddedKeywordList,
              });
              this.$refs.elForm.resetFields();
            }
          }));
          break;
        }
        case 'DELETE_TAG': {
          console.log('DELETE_TAG', payload); // eslint-disable-line
          this.deleteKeyword({
            payload,
          });
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

<style lang="scss">
@import "~@/variables.scss";

#lecture_keywords_editor_wrapper {
  .el-input-group__append {
    background-color: lighten($--color-primary, 15%);
    i {
      color: lighten(yellow, 40%);
    }
  }
}
</style>

<style lang="scss" scoped>
#lecture_keywords_editor_wrapper {
  .tag {
    padding: 0 2em;
  }
}
</style>

