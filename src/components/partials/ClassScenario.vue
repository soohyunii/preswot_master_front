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
            v-if="type === 'TEACH'"
            prop="edit"
            label="수정">
            <template slot-scope="scope">
              <router-link :to="`/a/teacher/lecture/${scope.row.scId}/edit`">
                <el-button>
                  수정
                </el-button>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column
            v-if="type ==='TEACH'"
            prop="live"
            label="강의">
            <template slot-scope="scope">
              <el-button @click="onClick('OPEN_LIVE_MODAL', scope.row.scId)">
                강의
              </el-button>
            </template>
          </el-table-column>

           <el-table-column
            v-if="type ==='STUDY'"
            prop="live"
            label="강의 듣기">
            <template slot-scope="scope">
              <router-link :to="`/a/student/lecture/${scope.row.scId}/live`">
                <el-button>
                  강의 듣기
                </el-button>
              </router-link>
            </template>
          </el-table-column>


        </el-table>

        <br />
        <br />

        <el-col align="center">
          <el-button v-if="type === 'TEACH'" @click="clickAddScenario" type="primary">과목 시나리오 추가</el-button>
        </el-col>
      </div>
    </el-col>
    <el-col>
      <el-dialog
        title="Input Youtube Live Streaming Link"
        :visible.sync="isModalVisible"
      >
        <el-form :model="input" label-width="120px">
          <el-form-item label="Link Address">
            <el-input v-model="input.youtubeLink"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="onClick('CANCEL');"
          >
            Cancel
          </el-button>
          <el-button
            type="primary"
            @click="onClick('CONFIRM')"
            :disabled="input.youtubeLink.length === 0"
          >
            Confirm
          </el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import utils from '../../utils';

export default {
  name: 'ClassScenario',
  props: ['type'],
  async mounted() {
    const vm = this;
    try {
      await vm.getClass({ type: vm.type });
    } catch (error) {
      // TODO: wording 바꿀 필요 有
      vm.$notify({
        title: '요청 실패',
        message: '아직 개설된 강의가 없습니다.',
        type: 'error',
        duration: 0,
      });
    }
    vm.$forceUpdate();

    vm.$watch(
      () => (vm.currentClass),
      async () => {
        try {
          await vm.getClass({ type: vm.type });
        } catch (error) {
          // TODO: wording 바꿀 필요 有
          vm.$notify({
            title: '요청 실패',
            message: '아직 개설된 강의가 없습니다.',
            type: 'error',
            duration: 0,
          });
        }
        vm.$forceUpdate();
      },
    );
  },
  data() {
    return {
      scId: null,
      isModalVisible: false,
      input: {
        youtubeLink: 'https://www.youtube.com/embed/P-Ov-WcQYTw?autoplay=1',
      },
    };
  },
  computed: {
    ...mapGetters('class', [
      'currentTeachingClass',
      'currentStudyingClass',
    ]),
    currentClass() {
      const vm = this;
      let currentClass;
      switch (vm.type) {
        case 'STUDY': {
          currentClass = vm.currentStudyingClass;
          break;
        }
        case 'TEACH': {
          currentClass = vm.currentTeachingClass;
          break;
        }
        default: {
          throw new Error(`not defined type ${vm.type}`);
        }
      }
      return currentClass;
    },
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
    ...mapActions('class', [
      'getClass',
    ]),
    async onClick(type, scId) {
      const vm = this;
      switch (type) {
        case 'OPEN_LIVE_MODAL': {
          vm.isModalVisible = true;
          vm.scId = scId;
          break;
        }
        case 'CANCEL': {
          vm.isModalVisible = false;
          vm.input.youtubeLink = '';
          vm.scId = null;
          break;
        }
        case 'CONFIRM': {
          try {
            // TODO: send link to backend server
            // TODO: link validation should be needed
            // If Success
            vm.input.youtubeLink = "https://www.youtube.com/embed/" + vm.input.youtubeLink.split('v=')[1] + "?autoplay=1";
            vm.$router.push({
              path: `/a/teacher/lecture/${vm.scId}/live`,
              query: {
                link: vm.input.youtubeLink,
              },
            });
            vm.isModalVisible = false;
            vm.input.youtubeLink = '';
            vm.scId = null;
          } catch (error) {
            // TODO: show noti
            // console.error(error);
          }
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
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
