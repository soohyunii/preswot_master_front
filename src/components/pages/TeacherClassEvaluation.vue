<template>
  <div class="wrapper">
    <el-container>
      <el-main v-if="currentClass">

        <h2>{{ currentClass.name }}</h2><hr>
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handelSelect">
          <el-menu-item index="0">과목</el-menu-item>
          <el-submenu index="2">
            <template slot="title">강의 시나리오</template>
            <el-menu-item v-for="item in scenarioList" :index="item.lecture_id.toString()">
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
            <el-col :span="16" style="height: 300px; text-align: center">
              여기는 워드크라우드 <br />
              여기는 워드크라우드 <br />
              여기는 워드크라우드 <br />
              여기는 워드크라우드 <br />
              여기는 워드크라우드 <br />
              여기는 워드크라우드 <br />
              여기는 워드크라우드 <br />
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
              <el-table-column label="관련 문항" align="center">
                <template slot-scope="scope">
                  <el-tooltip v-for="question in scope.row.questions"
                              effect="dark"
                              placement="top">
                    <div slot="content">{{question.lecture_name}}<br />{{question.item_name}}</div>
                    <!---->
                    <!--여기부분 question.lecture_item_id 로 링크 만들어야댐-->
                    <!---->
                    <i class="el-icon-edit" style="margin-left: 5px"></i>
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
              <el-table-column label="관련 자료" align="center">
                <template slot-scope="scope">
                  <el-tooltip v-for="material in scope.row.materials"
                              effect="dark"
                              placement="top">
                    <div slot="content">{{material.lecture_name}}<br />{{material.item_name}}</div>
                    <!---->
                    <!--여기부분 material.lecture_item_id 로 링크 만들어야댐-->
                    <!---->
                    <i class="el-icon-edit" style="margin-left: 5px"></i>
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
  import coverageService from '../../services/coverageService';
  import ElButton from "element-ui/packages/button/src/button";

  export default {
    name: 'TeacherClassEvaluation',
    computed: {
      ...mapState('class', ['teachingClassList', 'currentClassIndex']),
      ...mapGetters('class', [
        'currentClass',
      ]),
      scenarioList: {
        get() {
          const vm = this;
          if (!vm.currentClass.scenarioList) {
            return [];
          }
          return vm.currentClass.scenarioList;
        },
      },
    },
    components: {
      ElButton
    },
    data() {
      return {
        coverage: null,
        activeIndex: '0',
        radio1: 'Question',
      };
    },
    async created() {
      const vm = this;
      if (!vm.currentClass) {
        await vm.getMyClassLists();
        vm.updateCurrentClassIndex({
          currentClassId: Number.parseInt(vm.$route.params.classId, 10),
        });
        await vm.getClass();
      }
      this.coverage = (await coverageService.getClassCoverage({
        id: Number.parseInt(vm.$route.params.classId, 10),
      })).data;
      console.log(this.coverage);
    },
    methods: {
      ...mapMutations('class', [
        'updateCurrentClassIndex',
      ]),
      ...mapActions('class', [
        'getMyClassLists',
        'getClass',
      ]),
      async handelSelect(key) {
        const vm = this;
        const keyInt = parseInt(key, 10);
        if (keyInt === 0) {
          this.coverage = (await coverageService.getClassCoverage({
            id: Number.parseInt(vm.$route.params.classId, 10),
          })).data;
        } else {
          this.coverage = (await coverageService.getLectureCoverage({
            id: keyInt,
          })).data;
        }
        console.log(this.coverage);
      },
    },
  };
</script>
