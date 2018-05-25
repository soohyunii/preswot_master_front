<template>
  <div id="lecture_keywords_editor_wrapper">
    lecture keywords editor template
    {{ keywordList }}
    <draggable element="div" v-model="keywordList" :move="onMove" :options="dragOptions">
      <transition-group type="transition">
        <el-tag class="tag" type="primary" v-for="k in keywordList" :key="k">{{ k }}</el-tag>
      </transition-group>
    </draggable>

    <el-form :model="input" :rules="rules" ref="elForm" label-width="125px" style="max-width: 400px;">
      <el-form-item label="키워드 입력" prop="keyword">
        <el-input v-model="input.keyword">
          <el-button type="success" slot="append" icon="el-icon-plus" @click="onClick('ADD')"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import deepCopy from 'deep-copy';
import draggable from 'vuedraggable';
import { mapMutations, mapState } from 'vuex';

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
          message: '입력해주세요.',
          trigger: 'blur,change',
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
    keywordList: {
      get() {
        const res = [];
        // JAVA에서의 List.addAll()
        Array.prototype.push.apply(res, this.$store.state.lc.keywordList);
        Array.prototype.push.apply(res, this.$store.state.lc.movedKeywordList);
        Array.prototype.push.apply(res, this.$store.state.lc.addedKeywordList);
        return res;
      },
      set(value) {
        // 여기서는 다른곳에서 다 해줘서 해줄 필요가 없다?
        console.log('lecture keyword set value', value); // eslint-disable-line
        // const movedKeywordList = this.$store.state.lc.recommendKeywordList.filter()

        // this.updateMovedKeywordList({
        //   movedKeywordList: value,
        // });
      },
    },
  },
  methods: {
    ...mapMutations('lc', [
      'updateMovedKeywordList',
      'updateAddedKeywordList',
    ]),
    onMove(/* { relatedContext, draggedContext } */) {
      // console.log('relatedContext fff', relatedContext); // eslint-disable-line
      // console.log('draggedContext fff', draggedContext); // eslint-disable-line
      // return false;
    },
    onClick(type) {
      switch (type) {
        case 'ADD': {
          this.$refs.elForm.validate(((valid) => {
            if (valid) {
              const newAddedKeywordList = deepCopy(this.addedKeywordList);
              newAddedKeywordList.push(this.input.keyword);
              this.updateAddedKeywordList({
                addedKeywordList: newAddedKeywordList,
              });
              this.input.keyword = '';
              this.$refs.elForm.resetFields();
            }
          }));
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

