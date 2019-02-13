<template>
  <div id="teacher_lecture_live_student_status_wrapper" class="bt-container">
    <h2>학생 접속 정보</h2>
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

    // 강의 아이템 목록, 과목, 강의명 가져오기
    const res = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });

  },
  data() {
    return {
      currentLectureItemId: [],
      itemList: [],
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
  components: {
    TeacherLectureLiveItem,
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