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
          <el-tab-pane label="시나리오 수정" name="first">
            <sc-editor />
          </el-tab-pane>
          <el-tab-pane label="시나리오 지식맵 수정" name="second">
            시나리오 지식맵 수정
          </el-tab-pane>
          <el-tab-pane label="시나리오 아이템 수정" name="thrid">
              <el-row :gutter="30" class="sc-row">
                <el-col :span="16">
                  <div>
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
                    <sc-material-editor
                      v-if="currentEditingScItemType === '강의자료'
                      || currentEditingScItemType === '숙제'"
                    />
                    <sc-survey-editor v-if="currentEditingScItemType === '설문'" />
                    <div v-if="currentEditingScItemType === '문항'">
                      TODO: 문항~~
                    </div>
                    <sc-active-time-editor />

                  </el-col>
                </el-row>
              </div>
          </el-tab-pane>
        </el-tabs>

        <div>
          <h2>debug</h2>
          server will get this:
          <pre style="font-size: 70%;">{{ DEBUGscenarioServerWillReceive }}</pre>
          currentEditingScItem: {{ currentEditingScItem }}<br/>
          currentEditingScItemType: {{ currentEditingScItemType }}
        </div>
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

export default {
  name: 'TeacherLectureNew',
  components: {
    Sc,
    ScEditor,
    ScItemAdder,
    ScCommonEditor,
    ScMaterialEditor,
    ScSurveyEditor,
    ScActiveTimeEditor,
  },
  data() {
    return {
      activeTab: 'first',
    };
  },
  async beforeMount() {
    const vm = this;
    vm.updateScId({
      scId: Number.parseInt(vm.$route.params.scId, 10),
    });
    await vm.getSc();
  },
  mounted() {
    const vm = this;
    vm.updateScType({
      scType: '강의', // TODO: delete?? 뭔가 지정해줘야하긴 하는데,
      // 이 플로우는 마음에 별로 안드는 상황
    });
  },
  computed: {
    ...mapState('teacher', ['scTitle', 'scType']),
    ...mapGetters('teacher', [
      'isScEmpty',
      'DEBUGscenarioServerWillReceive',
      'currentEditingScItem',
    ]),
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
    ...mapMutations('teacher', ['updateScType', 'updateScId']),
    ...mapActions('teacher', [
      'getSc',
    ]),
    onClickScType(scType) {
      const vm = this;
      vm.scType = scType;
    },
    test() {
      // console.log('test');
    },
  },
};
</script>
