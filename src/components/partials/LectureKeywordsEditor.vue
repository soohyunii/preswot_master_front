<template>
  <div id="lecture_keywords_editor_wrapper">
    <div v-show="extractMode === 0">
      <el-row>
        <el-col :span="12">
          <h3>강의 키워드 등록</h3>
            <!-- {{ keywordList }} -->
          <!--<draggable element="div" v-model="keywordList" :options="dragOptions">
            <transition-group type="transition">
              <el-tag class="tag" type="primary" v-for="k in keywordList" :key="k" closable @close="onClick('DELETE_TAG', k)">{{ k }}</el-tag>
            </transition-group>
          </draggable>-->
          <el-form @submit.native.prevent :model="input" :rules="rules" ref="elForm" label-width="125px" style="max-width: 400px;">
            <el-form-item label="강의 키워드 입력" prop="keyword">
              <el-input v-model="input.keyword" @keydown.enter.native="onClick('ADD')"></el-input>
            </el-form-item>
            <el-form-item label="중요도 입력" prop="weight">
              <el-input v-model="input.weight" type="number" min=1 max=100 @keydown.enter.native="onClick('ADD')">
                <el-button type="success" slot="append" icon="el-icon-plus" @click="onClick('ADD')"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <el-button style="position: relative; left: 125px" type="primary" @click="onClick('KEYWORD_EXTRACT_STEP_1')">자동 추출</el-button>
        </el-col>
        <el-col :span="12">
          <div id="lecture_keywords_table_wrapper">
            <table id="table_design" :data="keywordList">
              <thead>
                <tr>
                  <td>강의 키워드</td>
                  <td>중요도</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(k, index) in keywordList" :key="index">
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
            </table>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 자동 추출 관련 화면 -->
    <div v-show="extractMode !== 0">
      <el-button @click="clearKeywordTab" icon="el-icon-back">뒤로 가기</el-button>
    </div>
    <div v-show="extractMode === 1">
      <h3>키워드 자동 추출</h3>
      <h5>Step1. 키워드를 추출할 파일을 모두 선택하세요.</h5>
      <el-table
      ref="multipleTable"
      :data="fileList"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="강의에 등록된 모든 파일">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
    </el-table>
    <el-button @click="onClick('KEYWORD_EXTRACT_STEP_2')">다음 단계로</el-button>
    </div>

    <div v-show="extractMode === 2">
      <h3>키워드 자동 추출</h3>
      <h5>Step2. 추출에 사용할 매개변수를 넣어주세요.</h5>
      <el-form @submit.native.prevent :model="input" :rules="rules" ref="elForm" label-width="125px" style="max-width: 400px;">
        <el-form-item label="w1" prop="keyword">
          <el-input v-model="wordPercentage"></el-input>
        </el-form-item>
        <el-form-item label="w2" prop="weight">
          <el-input v-model="fileAtLeast"></el-input>
        </el-form-item>
      </el-form>
      <p> W1 : 각 파일에서 상대 중요도에 따른 상위 w1% 단어를 추출합니다. 범위: 0 ~ 1 사이의 실수 </p>
      <p> W2 : 각 파일에서 상대 중요도에 따라서 뽑힌 상위 w1% 단어가 다른 파일에서 얼마나 쓰이는지 나타내는 빈도수 비율이 최소 w2%를 넘기면 키워드로 추출합니다. 범위: 0 ~ 1 사이의 실수 </p>
      <el-button @click="onClick('KEYWORD_EXTRACT_STEP_1')">이전으로</el-button>
      <el-button @click="onClick('KEYWORD_EXTRACT_STEP_3')">다음 단계로</el-button>
    </div>

    <div v-show="extractMode === 3">
      <h3>키워드 자동 추출</h3>
      <h5>강의 자료에서 키워드를 추출하는중입니다.</h5>
      <i style="font-size: 30px;" class="fas el-icon-loading"></i>
    </div>

    <div v-show="extractMode === 4">
      <h3>키워드 자동 추출</h3>
      <h5>Step3. 강의에 추가할 키워드를 모두 추가해주세요.</h5>
      <el-table :data="extractedKeywordList">
        <el-table-column label="추출된 키워드" align="center" prop="keyword">
        </el-table-column>
        <el-table-column label="중요도" align="center" prop="score">
        </el-table-column>
        <el-table-column label="" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="onClick('ADD_KEYWORD',scope.row)">추가하기</el-button>
            <!-- TODO: <el-button type="danger">불용어로 추가</el-button> TODO: 불용어를 넣는다면 어디서 삭제할까요?-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import deepCopy from 'deep-copy';
import draggable from 'vuedraggable';
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import { EventBus } from '../../event-bus';
import lectureService from '../../services/lectureService';

export default {
  name: 'LectureKeywordsEditor',
  components: {
    draggable,
  },
  mounted() {
    const vm = this;
    EventBus.$on('clearKeywordTab', vm.clearKeywordTab);
  },
  data() {
    return {
      wordPercentage: 0.5,
      fileAtLeast: 0,
      multipleSelection: [], // 추출 파일목록 체크박스값
      fileList: [], // 추출 파일 대상 목록
      extractMode: 0, // 0 : 키워드 수동 등록 화면, 1 ~ 3 : 키워드 자동 등록 과정
      extractedKeywordList: [],
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearKeywordTab() {
      const vm = this;
      vm.multipleSelection.length = 0; // 파일목록 체크박스 배열 초기화
      vm.extractMode = 0; // 추출 모드 화면 번호 초기화
    },
    async onClick(type, payload) {
      const vm = this;
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
                vm.$notify({
                  title: '알림',
                  message: '키워드에 대한 중요도는 100 이하 1 이상의 값으로 입력해주세요.',
                  type: 'warning',
                });
                this.$refs.elForm.resetFields();
                return;
              }
              if (this.isKeywordDuplicated(keyname)) {
                // TODO: notify user the keyword is duplicated
                vm.$notify({
                  title: '알림',
                  message: '이미 추가된 키워드입니다.',
                  type: 'warning',
                });
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
        case 'ADD_KEYWORD': {
          if (this.isKeywordDuplicated(payload.keyword)) {
            // TODO: notify user the keyword is duplicated
            vm.$notify({
              title: '알림',
              message: '중복된 키워드입니다.',
              type: 'warning',
            });
            return;
          }
          const dictKeyword = {};
          dictKeyword.keyword = payload.keyword;
          dictKeyword.weight = payload.score;
          dictKeyword.edit = false;
          const newKeywordList = deepCopy(this.keywordList);
          newKeywordList.push(dictKeyword);
          this.updateKeywordList({
            keywordList: newKeywordList,
          });
          this.postLectureKeywords();
          vm.$notify({
            title: '알림',
            message: '키워드가 추가되었습니다.',
            type: 'success',
          });
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
              vm.$notify({
                title: '알림',
                message: '키워드에 대한 중요도는 100 이하 1 이상의 값으로 입력해주세요.',
                type: 'warning',
              });
              return;
            }
          }
          payload.edit = !payload.edit; // eslint-disable-line
          this.postLectureKeywords();
          break;
        }
        case 'KEYWORD_EXTRACT_STEP_1': {
          vm.fileList.length = 0; // 추출할 파일 이름 목록 초기화
          const res = await lectureService.getAllFilesUnderLecture({
            lectureId: vm.$route.params.lectureId,
          });

          if (res.data.material_files instanceof Array) {
            res.data.material_files.forEach((element) => {
              element.name += ' @ 강의 자료 업로드'; // eslint-disable-line
              vm.fileList.push(element);
            });
          }

          if (res.data.note_files instanceof Array) {
            res.data.note_files.forEach((element) => {
              element.name += ' @ 강의 아이템 - 자료'; // eslint-disable-line
              vm.fileList.push(element);
            });
          }

          if (res.data.question_files instanceof Array) {
            res.data.question_files.forEach((element) => {
              element.name += ' @ 강의 아이템 - 문항'; // eslint-disable-line
              vm.fileList.push(element);
            });
          }

          // console.log('vm.fileList = ', vm.fileList);
          this.extractMode = 1;
          break;
        }
        case 'KEYWORD_EXTRACT_STEP_2': {
          this.extractMode = 2;
          break;
        }
        case 'KEYWORD_EXTRACT_STEP_3': {
          vm.extractedKeywordList.splice(0, Number.MAX_VALUE);
          this.extractMode = 3;
          const res = await lectureService.autoExtractKeyword({
            lectureId: vm.$route.params.lectureId,
            guidList: vm.multipleSelection.map(x => x.file_guid),
            w1: vm.wordPercentage,
            w2: vm.fileAtLeast,
          });
          const wordToKeyword = res.data.keyword.map(x => ({
            keyword: x.word,
            score: x.score,
          }));
          wordToKeyword.forEach((element) => {
            vm.extractedKeywordList.push(element);
          });
          vm.extractMode = 4;
          break;
        }
        case 'CANCEL_EDIT': {
          this.extractMode = false;
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
