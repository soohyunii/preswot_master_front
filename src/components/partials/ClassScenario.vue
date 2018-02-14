<template>
  <el-row :gutter="20">
    <el-col>
      <div class="grid-content bg-white">
        <!-- TODO: translate -->
        시나리오 목록
        <hr />
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="index"
            label="번호"
            sortable
            width="70">
            <template slot-scope="scope">
              {{ scope.row.index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="분류"
            sortable
            width="70">
            <template slot-scope="scope">
              <el-tag>
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="scType"
            label="시나리오 타입"
            sortable>
          </el-table-column>
          <el-table-column
            prop="teacher"
            label="강사"
            sortable>
          </el-table-column>
          <el-table-column
            prop="title"
            label="시나리오명"
            sortable>
          </el-table-column>
          <el-table-column
            prop="date"
            label="기간"
            sortable>
          </el-table-column>
          <el-table-column
            prop="student"
            label="참여 수강생 수"
            sortable
            width="130">
          </el-table-column>
          <el-table-column
            prop="understanding"
            label="수강생 이해도 (평균)"
            sortable>
            <template slot-scope="scope">
              <el-progress
                v-if="scope.row.understanding === 100"
                :text-inside="true"
                :stroke-width="18"
                :percentage="scope.row.understanding"
                status="success">
              </el-progress>
              <el-progress
                v-else-if="scope.row.understanding > 70"
                :text-inside="true"
                :stroke-width="18"
                :percentage="scope.row.understanding">
              </el-progress>
              <el-progress
                v-else
                :text-inside="true"
                :stroke-width="18"
                :percentage="scope.row.understanding"
                status="exception">
              </el-progress>
            </template>
          </el-table-column>
          <el-table-column
            prop="edit"
            label="수정">
            <template slot-scope="scope">
              <el-button
                @click="$router.push(`/a/teacher/lecture/${scope.row.scId}/edit`);"
              >
                수정
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <br />
        <br />

        <el-col align="center">
          <el-button @click="clickAddScenario" type="primary">과목 시나리오 추가</el-button>
        </el-col>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import utils from '../../utils';

export default {
  name: 'ClassScenario',
  async mounted() {
    const vm = this;
    await vm.fetchClass();
    vm.$forceUpdate();

    vm.$watch(
      () => (vm.currentClass),
      async () => {
        await vm.fetchClass();
        vm.$forceUpdate();
      },
    );
  },
  computed: {
    ...mapGetters('teacher', [
      'currentClass',
    ]),
    tableData: {
      get() {
        const vm = this;
        if (!vm.currentClass.scenarioList) {
          return [];
        }
        return vm.currentClass.scenarioList.map((sc, index) => {
          const type = utils.convertScType(sc.type);

          const date = (() => {
            if (!sc.intended_start) {
              return '미정 TODO: 미정 없어져야함'; // TODO: intended_start 꼭 있어야함!
            }
            const startDate = new Date(sc.intended_start);
            if (!sc.intended_end) {
              return `${utils.formatDate(startDate)} ~ 계속`;
            }
            const endDate = new Date(sc.intended_end);
            return `${utils.formatDate(startDate)} ~ ${utils.formatDate(endDate)}`;
          })();

          return {
            index,
            type,
            scId: sc.lecture_id,
            scType: '실시간',
            teacher: sc.teacher_id,
            title: sc.name,
            date,
          };
        });
      },
      // set(tableData) {

      // },
    },
  },
  methods: {
    ...mapActions('sc', [
      'createSc',
    ]),
    ...mapActions('teacher', [
      'fetchClass',
    ]),
    // getType(type) {
    //   // 과목 시나리오 유형 분류 {{ A: 강의, B: 숙제, C: 퀴즈, D: 시험 }}
    //   // TODO: Translate
    //   switch (type) {
    //     default:
    //     case 'A':
    //       return {
    //         name: '강의',
    //         type: '',
    //       };
    //     case 'B':
    //       return {
    //         name: '숙제',
    //         type: 'warning',
    //       };
    //     case 'C':
    //       return {
    //         name: '퀴즈',
    //         type: 'danger',
    //       };
    //     case 'D':
    //       return {
    //         name: '시험',
    //         type: 'info',
    //       };
    //   }
    // },
    async clickAddScenario() {
      const vm = this;
      try {
        const scId = await vm.createSc();
        vm.$router.push(`/a/teacher/lecture/${scId}/edit`);
      } catch (error) {
        vm.$notify({
          title: '강좌 생성 실패',
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      }
    },
  },
};
</script>

<style scoped>
  .bg-white {
    background-color: rgb(255, 255, 255);
  }

  .grid-content {
    border-radius: 4px;
    min-height: 500px;
    padding: 25px;
    margin-bottom: 30px;
  }
</style>