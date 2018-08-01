<template>
  <div id="lecture_keywords_editor_wrapper">
    <el-row>
      <el-col :span="12">
        <h3>키워드 등록</h3>
          <!-- {{ keywordList }} -->
        <!--<draggable element="div" v-model="keywordList" :options="dragOptions">
          <transition-group type="transition">
            <el-tag class="tag" type="primary" v-for="k in keywordList" :key="k" closable @close="onClick('DELETE_TAG', k)">{{ k }}</el-tag>
          </transition-group>
        </draggable>-->
        <el-form @submit.native.prevent :model="input" :rules="rules" ref="elForm" label-width="125px" style="max-width: 400px;">
          <el-form-item label="키워드 입력" prop="keyword">
            <el-input v-model="input.keyword" @keydown.enter.native="onClick('ADD')"></el-input>
          </el-form-item>
          <el-form-item label="중요도 입력" prop="weight">
            <el-input v-model="input.weight" type="number" min=1 max=100 @keydown.enter.native="onClick('ADD')">
              <el-button type="success" slot="append" icon="el-icon-plus" @click="onClick('ADD')"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div id="lecture_keywords_table_wrapper">
          <table id="table_design" :data="keywordList">
            <thead>
              <tr>
                <td>키워드</td>
                <td>중요도</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="k in keywordList" :key="k">
                <td>
                  <el-input v-model="k.keyword" v-show="k.edit"></el-input>
                  <span v-show="!k.edit">{{ k.keyword }}</span>
                </td>
                <td>
                  <el-input v-model="k.weight" type="number" min=1 max=100 v-show="k.edit"></el-input>
                  <span v-show="!k.edit">{{ k.weight }}</span>
                </td>
                <td>
                  <el-button type="small" @click="onClick('EDIT_KEYWORD', k)">{{ k.edit ? '완료' : '수정' }}</el-button>
                  <el-button type="small" @click="onClick('DELETE_TAG', k)">삭제</el-button>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>중요도 총합</td>
                <td>{{ totalWeight }}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
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
        weight: 1,
      },
      rules: {
        keyword: {
          required: true,
          message: '한 글자 이상 키워드를 입력해주세요.',
          trigger: 'change',
        },
        weight: {
          required: false,
          message: '중요도를 숫자로 입력해주세요.',
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
    ...mapState('keyword', [
      'addedKeywordList',
    ]),
    ...mapGetters('keyword', [
      'isKeywordDuplicated',
    ]),
    keywordList: {
      get() {
        const res = [];
        // JAVA에서의 List.addAll()
        Array.prototype.push.apply(res, this.$store.state.keyword.keywordList);
        Array.prototype.push.apply(res, this.$store.state.keyword.movedKeywordList);
        Array.prototype.push.apply(res, this.$store.state.keyword.addedKeywordList);
        return res;
      },
      set(/* value */) {
        // NOTE: 여기서는 다른곳에서 다 해줘서 해줄 필요가 없다?
        // 그래도 set 함수가 없으면 vue가 꼬장부려서 놔둠
        // console.log('lecture keyword set value', value); // eslint-disable-line
      },
    },
    // 강의 키워드 총합 계산
    totalWeight() {
      return this.keywordList.reduce((totalWeight, item) => { // eslint-disable-line
        return (totalWeight + parseInt(item.weight, 10));
      }, 0);
    },
  },
  methods: {
    ...mapMutations('keyword', [
      'updateMovedKeywordList',
      'updateAddedKeywordList',
      'updateKeywordList',
    ]),
    ...mapActions('keyword', [
      'deleteKeyword',
      'postLectureKeywords',
      'deleteLectureKeywords',
    ]),
    onClick(type, payload) {
      switch (type) {
        case 'ADD': {
          this.$refs.elForm.validate(((valid) => {
            if (valid) {
              const keyname = this.input.keyword;
              const keyvalue = this.input.weight;
              // const keyvalue = this.input.keyword.keyvalue;
              if (keyname.length === 0) {
                // 존나 이유를 모르겠는데 가끔 keydown이 두번씩 들어옴 그걸 validate에서 거르지도 못함 병신임
                return;
              }
              // keyvalue의 값을 입력하지 않았거나 그 값이 1~100 사이의 값이 아닐 경우 다시 값을 요청받음
              if (keyvalue > 100 || keyvalue < 1 || keyvalue.length === 0) {
                alert('키워드에 대한 중요도는 100 이하 1 이상의 값으로 입력해주세요.'); // eslint-disable-line
                this.$refs.elForm.resetFields();
                return;
              }
              if (this.isKeywordDuplicated(keyname)) {
                // TODO: notify user the keyword is duplicated
                this.$refs.elForm.resetFields();
                return;
              }
              const dictKeyword = {};
              dictKeyword.keyword = keyname;
              dictKeyword.weight = keyvalue;
              dictKeyword.edit = false;
              const newKeywordList = deepCopy(this.keywordList);
              newKeywordList.push(dictKeyword);
              this.updateKeywordList({
                keywordList: newKeywordList,
              });
              this.postLectureKeywords();
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
          this.deleteLectureKeywords();
          break;
        }
        // 키워드 테이블에서 수정
        case 'EDIT_KEYWORD': {
          const keyvalue = payload.weight;
          if (payload.edit === true) {
            if (keyvalue > 100 || keyvalue < 1 || keyvalue.length === 0) {
              alert('키워드에 대한 중요도는 1 이상 100 이하의 값으로 입력해주세요.'); // eslint-disable-line
              return;
            }
          }
          payload.edit = !payload.edit; // eslint-disable-line
          this.postLectureKeywords();
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


<style>
#table_design {
    border-collapse: collapse;
    text-align: center;
    line-height: 1.5;
    border-top: 1px solid #321;
    border-bottom: 1px solid #321;
    border-block-end: 1px solid #321;
    margin: 20px 10px;
}
#table_design thead {
    width: 150px;
    padding: 10px;
    vertical-align: top;
    color: #111;
    background: rgb(160, 213, 250);
    margin: 20px 10px;
}
#table_design td {
    width: 350px;
    padding: 10px;
    font-size: 15px;
    color: #333;
}
#table_design tbody {
    border-bottom: 1px solid #321;
}
</style>
