<template>
  <div>
    <el-container>
      <el-aside width="150px">
        <!-- <teaching-class-list-aside /> -->
        <button @click="test">test</button>
      </el-aside>

      <!-- 이 메인은 맞음 시작 -->
      <el-main>
        <el-row :gutter="5">
          <el-col :span="3">
            <!-- TODO: translate -->
            <el-dropdown @command="onClickScType">
              <el-button type="primary" size="medium" disabled>
                분류 : {{ scType }}<i class="el-icon-edit el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="강의">강의</el-dropdown-item>
                <el-dropdown-item command="숙제">숙제</el-dropdown-item>
                <el-dropdown-item command="퀴즈">퀴즈</el-dropdown-item>
                <el-dropdown-item command="시험">시험</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>

          <el-col :span="8">
            <h3 class="lecture-name">
              {{ scTitle }}
              <i class="el-icon-edit"></i>
            </h3>
          </el-col>

        </el-row>
        <hr><br />

        <el-tabs class="tabs" v-model="activeTab">
          <el-tab-pane label="강의 수정" name="first">
            <sc-editor />
          </el-tab-pane>
          <el-tab-pane label="강의 지식맵 수정" name="second">
            <knowledge-map v-if="activeTab === 'second'" />
          </el-tab-pane>
          <el-tab-pane label="강의 아이템 수정" name="third">
              <el-row :gutter="30" class="sc-row">
                <el-col :span="16">
                  <div>
                    <h3 style="display: inline-block;">필터</h3> &nbsp;
                    <el-radio-group v-model="scOrderFilter">
                      <el-radio-button :label="null">모두</el-radio-button>
                      <el-radio-button :label="0">예습</el-radio-button>
                      <el-radio-button :label="1">본강</el-radio-button>
                      <el-radio-button :label="2">복습</el-radio-button>
                    </el-radio-group>
                    <br />
                    <br />
                    <sc />
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <sc-item-adder />
                  </div>
                </el-col>
              </el-row>

              <div id="app_lecture_editor" v-show="!isScEmpty">
                <el-row :gutter="30">
                  <el-col :span="24">
                    <h1>아이템 편집</h1>
                    <sc-common-editor />
                    <sc-material-editor v-if="currentEditingScItemType === '강의자료'" />
                    <sc-homework-editor v-if="currentEditingScItemType === '숙제'" />
                    <sc-survey-editor v-if="currentEditingScItemType === '설문'" />
                    <sc-question-editor v-if="currentEditingScItemType === '문항'" />
                    <sc-active-time-editor :type="currentEditingScItemType" />

                  </el-col>
                </el-row>
              </div>
          </el-tab-pane>
          <el-tab-pane label="강의 삭제" name="fourth">
            <el-row>
              <el-col style="max-width: 600px;">
                <el-form label-width="120px">
                  <el-form-item label="강의 삭제">
                    <el-button type="danger" @click="onClickDelete">강의 삭제</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="강의 허용 프로그램 수정" name="fifth">
            <sc-accept-plist />
          </el-tab-pane>
        </el-tabs>

      </el-main>
      <!-- 이 메인은 맞음 끝 -->
    </el-container>

  </div>
</template>

<style lang="scss" scoped>
@import "~@/variables.scss";

#app_lecture_editor {
  margin-top: 2vh;
  padding: 0px 20px 20px 20px;
  background-color: white;
}

.lecture-name {
  margin: 8px 0;
}
.tabs {
  background-color: white;
  padding: 1.5vh 2.5vw;
  border-radius: 5px;
}
.sc-row {
  padding: 20px;
  background-color: $app-oatmeal;
}
</style>


<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import Sc from '../partials/Sc';
import ScEditor from '../partials/ScEditor';
import ScItemAdder from '../partials/ScItemAdder';
import ScMaterialEditor from '../partials/ScMaterialEditor';
import ScActiveTimeEditor from '../partials/ScActiveTimeEditor';
import ScCommonEditor from '../partials/ScCommonEditor';
import ScSurveyEditor from '../partials/ScSurveyEditor';
import ScQuestionEditor from '../partials/ScQuestionEditor';
import ScHomeworkEditor from '../partials/ScHomeworkEditor';
import ScAcceptPlist from '../partials/ScAcceptPlist';
import KnowledgeMap from '../partials/KnowledgeMap';

export default {
  name: 'TeacherLectureNew',
  components: {
    Sc,
    ScEditor,
    ScItemAdder,
    ScCommonEditor,
    ScQuestionEditor,
    ScMaterialEditor,
    ScHomeworkEditor,
    ScSurveyEditor,
    ScActiveTimeEditor,
    KnowledgeMap,
    ScAcceptPlist,
  },
  data() {
    return {
      activeTab: 'first', // TODO: change to first
    };
  },
  async beforeMount() {
    const vm = this;
    vm.updateScId({
      scId: Number.parseInt(vm.$route.params.scId, 10),
    });
    switch (vm.$route.query.type) {
      case 'QUESTION_KEYWORD_EDIT':
      case 'MATERIAL_KEYWORD_EDIT': {
        vm.activeTab = vm.$route.query.tab;
        const queryScItemId = Number.parseInt(vm.$route.query.scItemId, 10);
        const targetScItemIndex = vm.sc.findIndex(item => item.id === queryScItemId);
        vm.updateCurrentEditingScItemIndex({
          currentEditingScItemIndex: targetScItemIndex,
        });
        break;
      }
      default: {
        // 의도적으로 비워둔 곳
      }
    }
    // TODO: handle if scId doens't exists
    // TODO: handle if scId exists but don't have the authorization
    await vm.getSc();
    if (!vm.isScEmpty) {
      // 문항, 강의자료의 id가 이 단계에서 얻어짐 => getItemKeywords() 함수에서 이 id를 이용
      await vm.getScItem({
        scItemId: vm.currentEditingScItem.id,
      });
      if (['문항', '강의자료'].includes(vm.currentEditingScItemType)) {
        vm.getItemKeywords();
      }
    }

    // 마지막에,
    // 아무것도 선택되어있지 않고 scItem이 하나라도 있다면 제일 앞에거 선택
    if (!vm.isScEmpty && !vm.currentEditingScItem) {
      vm.updateCurrentEditingScItemIndex({
        currentEditingScItemIndex: 0,
      });
    }
  },
  mounted() {
    const vm = this;
    vm.updateScType({
      scType: '강의', // TODO: delete?? 뭔가 지정해줘야하긴 하는데,
      // 이 플로우는 마음에 별로 안드는 상황
    });
  },
  computed: {
    ...mapState('sc', ['scTitle', 'scType']),
    ...mapState('scItem', [
      'sc',
    ]),
    ...mapGetters('scItem', [
      'isScEmpty',
      'currentEditingScItem',
    ]),
    scOrderFilter: {
      get() {
        const vm = this;
        return vm.$store.state.sc.scOrderFilter;
      },
      set(scOrderFilter) {
        const vm = this;
        vm.updateScOrderFilter({
          scOrderFilter,
        });
      },
    },
    currentEditingScItemType() {
      const vm = this;
      const item = vm.currentEditingScItem;
      if (!item) {
        return null;
      }
      return item.type;
    },
  },
  methods: {
    ...mapMutations('sc', [
      'updateScType',
      'updateScId',
      'updateAfterStartDateOffsetSec',
      'updateScOrderFilter',
    ]),
    ...mapMutations('scItem', [
      'updateCurrentEditingScItemIndex',
    ]),
    ...mapActions('sc', [
      'getSc',
      'deleteSc',
    ]),
    ...mapActions('scItem', [
      'getScItem',
      'getItemKeywords',
    ]),
    onClickScType(scType) {
      const vm = this;
      vm.scType = scType;
    },
    test() {
      // console.log('test');
    },
    onClickDelete() {
      const vm = this;
      vm.$confirm('정말로 이 강의를 삭제하시겠습니까?', `${vm.scTitle || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            await vm.deleteSc();
            vm.$notify({
              title: '삭제됨',
              message: '강의가 삭제됨',
              type: 'success',
              duration: 3000,
            });
            vm.$router.push('/a/teacher/class');
          } catch (error) {
            vm.$notify({
              title: '강의 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '강의 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
    },
  },
};
</script>
