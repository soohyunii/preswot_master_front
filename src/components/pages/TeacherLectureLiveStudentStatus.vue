<template>
  <div id="teacher_lecture_live_student_status_wrapper" class="bt-container">
    <h2>학생 접속 정보</h2>
    <el-table :data="studentList" border="true">
      <el-table-column label="이름" prop="name" />
      <el-table-column label="이메일" prop="email" />
      <el-table-column label="현재 접속 여부" prop="current" />
      <el-table-column label="IP count" prop="ip" />
      <el-table-column label="재접속 허용" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="itemShow(scope.row)">
            보기
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import lectureService from '../../services/lectureService';
import authService from '../../services/authService';
import lectureItemService from '../../services/lectureItemService';
import TeacherLectureLiveItem from '../partials/TeacherLectureLiveItem';
import utils from '../../utils';

export default {
  name: 'TeacherLectureLiveStudentStatus',
  async created() {
    const vm = this;
    vm.lid = vm.lectureId;
    // 학생이 url로 접근하는 경우 방지
    const accessId = utils.getUserIdFromJwt();
    const accessCheck = await authService.returnUserInfo({
      userID: accessId,
    });
    if (accessCheck.data.userInfo.type === 0) {
      vm.$router.push('/');
    }

    // 소켓 연결 - 주기적으로 학생 접속 정보 받아오기 위해
    vm.$socket.connect();

    // 출석 변동 있는 경우 - 실시간 출석 정보 (출석 여부, ip count, 학생 재접속 허가 등)
    vm.$socket.on('CHECK_STUDENT_LIST', (msg) => {
      const jsonMSG = JSON.parse(msg);
      // 우선 리스트 초기화
      vm.studentList = [];
      // 출석자, 결석자 명단 갱신
      jsonMSG.forEach((x, index) => {
        const tmp = {};
        tmp.num = index + 1;
        tmp.name = x.name;
        tmp.email = x.email_id;
        tmp.id = x.user_id;
        if (x.current === 1) { // 현재 출석중
          tmp.current = '출석 중';
        } else if (x.in_cnt > 0) { // 출석했지만 나감
          tmp.current = '출석 후 이탈';
        } else {
          tmp.current = '미출석';
        }
        vm.studentList.push(tmp);
      });
    });
  },
  data() {
    return {
      studentList: [], // 학생 리스트
    };
  },
  computed: {
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.classId, 10);
    },
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.lectureId, 10);
    },
  },
  methods: {
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'SUBMIT': {
          vm.$notify({
            title: '알림',
            message: '이 버튼은 현재 수강중인 학생만 이용할 수 있습니다.',
            type: 'warning',
          });
          break;
        }
        default: {
          break;
        }
      }
    },
    // 그룹별로 색 다르게 해 표시
    tRCName({ row }) {
      if (row.group % 2 === 1) {
        return 'odd';
      }
      return 'even';
    },
  },
};
</script>

<style>
.el-table .odd {
  background: beige;
}
.el-table .even {
  background: paleturquoise;
}
</style>