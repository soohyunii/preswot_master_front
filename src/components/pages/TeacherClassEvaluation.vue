<template>
  <div class="wrapper">
    <el-container>
      <el-main v-if="currentTeachingClass">

        <h2>{{ currentTeachingClass.name }}</h2><hr>
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handelSelect">
          <el-menu-item index="0">과목</el-menu-item>
          <el-submenu index="2">
            <template slot="title">강의 시나리오</template>
            <el-menu-item v-for="item in scenarioList" :index="item.lecture_id.toString()" :key="item.name">
              {{ item.name }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <br />
        <br />

        <div v-if="coverage" style="min-height: 600px;">
          <h3>중요 키워드</h3>
          <br />
          <el-row :gutter="40">
            <el-col :span="16">
              <word-cloud
                style="min-height: 500px;"
                :data="forWordCloud"
                nameKey="keyword"
                valueKey="qweasd"
                fontScale="n"
                :fontSize="[20, 100]"
                :wordClick="() => {}"
              >
              </word-cloud>
            </el-col>
            <el-col :span="8">
              <el-table
                :data="coverage.keyword_coverages"
                border height="300">
                <el-table-column label="Keyword" align="center" prop="keyword" sortable>
                </el-table-column>
                <el-table-column label="Weight" align="center" prop="weight" sortable>
                </el-table-column>
              </el-table>

            </el-col>
          </el-row>
          <br />
          <br />

          <el-row :gutter="10">
            <el-col :span="5" style="width:190px; ">
              <h3>평균 커버리지 수치</h3>
            </el-col>
            <el-col :span="8" style="margin-top: 15px;">
              <el-radio-group v-model="radio1" size="small">
                <el-radio-button label="Question" ></el-radio-button>
                <el-radio-button label="Item"></el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <br />

          <div v-if="radio1 === 'Question'">
            <el-row :gutter="40">
              <el-col :span="12" align-center>
                <h2 v-if="coverage.avg_coverage.question_error">{{coverage.avg_coverage.question_error}}</h2>
                <h2 v-else>계산되지 않음</h2>
              </el-col>
              <el-col :span="12">
                평균 커버리지 수치: 0에 가까울 수록 문항 키워드 배점이 적절함을 뜻함 <br /><br />
                키워드별 오차: 문항 키워드와 강의 키워드 간의 오차<br />
                오차가 음수인 경우: 문항에서 키워드의 배점이 높음<br />
                오차가 양수인 경우: 문항에서 키워드의 배점이 낮음
              </el-col>
            </el-row>
            <br />
            <br />
            <h3>키워드별 오차</h3>
            <br />
            <el-table
              :data="coverage.keyword_coverages"
              border height="300" style="width: 100%">
              <el-table-column label="Keyword" align="center" prop="keyword" sortable>
              </el-table-column>
              <el-table-column label="Error" align="center" prop="difference_question" sortable>
              </el-table-column>
              <el-table-column label="관련 문항 키워드 수정" align="center">
                <template slot-scope="scope">
                  <el-tooltip v-for="(question, index) in scope.row.questions"
                              effect="dark"
                              placement="top"
                              :key="index">
                    <div slot="content">
                      {{question.lecture_name}}<br />
                      {{question.item_name}} <br />
                      {{ question }}

                    </div>
                    <!---->
                    <!--여기부분 question.lecture_item_id 로 링크 만들어야댐-->
                    <!---->
                    <i class="el-icon-edit" style="margin-left: 5px" @click="onClick('QUESTION_KEYWORD_EDIT', question)"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="radio1 === 'Item'">
            <el-row :gutter="40">
              <el-col :span="12" align-center>
                <h2 v-if="coverage.avg_coverage.material_error">{{coverage.avg_coverage.material_error}}</h2>
                <h2 v-else>계산되지 않음</h2>
              </el-col>
              <el-col :span="12">
                평균 커버리지 수치: 0에 가까울 수록 자료 키워드 배점이 적절함을 뜻함 <br /><br />
                키워드별 오차: 자료 키워드와 강의 키워드 간의 오차<br />
                오차가 음수인 경우: 자료에서 키워드의 배점이 높음<br />
                오차가 양수인 경우: 자료에서 키워드의 배점이 낮음
              </el-col>
            </el-row>
            <br />
            <br />
            <h3>키워드별 오차</h3>
            <br />
            <el-table
              :data="coverage.keyword_coverages"
              border height="300">
              <el-table-column label="Keyword" align="center" prop="keyword" sortable>
              </el-table-column>
              <el-table-column label="Error" align="center" prop="difference_material" sortable>
              </el-table-column>
              <el-table-column label="관련 자료 키워드 수정" align="center">
                <template slot-scope="scope">
                  <el-tooltip v-for="(material, index) in scope.row.materials"
                              effect="dark"
                              placement="top"
                              :key="index">
                    <div slot="content">{{material.lecture_name}}<br />{{material.item_name}}</div>
                    <!---->
                    <!--여기부분 material.lecture_item_id 로 링크 만들어야댐-->
                    <!---->
                    <i class="el-icon-edit" style="margin-left: 5px" @click="onClick('MATERIAL_KEYWORD_EDIT', material)"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
main {
  min-height: 800px;
}
</style>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import WordCloud from '../partials/WordCloud';

export default {
  name: 'TeacherClassEvaluation',
  components: {
    WordCloud,
  },
  computed: {
    ...mapState('class', ['teachingClassList', 'currentClassIndex', 'currentClassCoverage']),
    ...mapState('sc', ['scCoverage']),
    ...mapGetters('class', [
      'currentTeachingClass',
    ]),
    scenarioList: {
      get() {
        const vm = this;
        if (!vm.currentTeachingClass.scenarioList) {
          return [];
        }
        return vm.currentTeachingClass.scenarioList;
      },
    },
  },
  data() {
    return {
      coverage: null,
      forWordCloud: null,
      activeIndex: '0',
      radio1: 'Question',
    };
  },
  async created() {
    const vm = this;
    if (!vm.currentTeachingClass) {
      await vm.getMyClassLists();
      vm.updateCurrentClassIndex({
        currentClassId: Number.parseInt(vm.$route.params.classId, 10),
      });
      await vm.getClass({ type: 'TEACHER' });
    }
    await vm.getClassCoverage({ type: 'TEACHER' });
    vm.coverage = vm.currentClassCoverage;
    vm.forWordCloud = JSON.parse(JSON.stringify(vm.currentClassCoverage.keyword_coverages));

    for (let i = 0; i < vm.forWordCloud.length; i += 1) {
      vm.forWordCloud[i].qweasd = vm.forWordCloud[i].weight;
    }
  },
  methods: {
    ...mapMutations('class', [
      'updateCurrentClassIndex',
    ]),
    ...mapActions('class', [
      'getMyClassLists',
      'getClass',
      'getClassCoverage',
    ]),
    ...mapActions('sc', ['getScCoverage']),
    async handelSelect(key) {
      const vm = this;
      const keyInt = parseInt(key, 10);
      if (keyInt === 0) {
        await vm.getClassCoverage({ type: 'TEACHER' });
        vm.coverage = vm.currentClassCoverage;
        vm.forWordCloud = JSON.parse(JSON.stringify(vm.currentClassCoverage.keyword_coverages));

        for (let i = 0; i < vm.forWordCloud.length; i += 1) {
          vm.forWordCloud[i].qweasd = vm.forWordCloud[i].weight;
        }
      } else {
        await vm.getScCoverage({ id: keyInt });
        vm.coverage = vm.scCoverage;
        vm.forWordCloud = JSON.parse(JSON.stringify(vm.scCoverage.keyword_coverages));

        for (let i = 0; i < vm.forWordCloud.length; i += 1) {
          vm.forWordCloud[i].qweasd = vm.forWordCloud[i].weight;
        }
      }
    },
    onClick(type, payload) {
      const vm = this;
      switch (type) {
        case 'QUESTION_KEYWORD_EDIT': {
          vm.$router.push({
            path: `/a/teacher/lecture/${payload.lecture_id}/edit`,
            query: {
              tab: 'third',
              type,
              scItemId: payload.lecture_item_id,
            },
          });
          break;
        }
        case 'MATERIAL_KEYWORD_EDIT': {
          vm.$router.push({
            path: `/a/teacher/lecture/${payload.lecture_id}/edit`,
            query: {
              tab: 'third',
              type,
              scItemId: payload.lecture_item_id,
            },
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
