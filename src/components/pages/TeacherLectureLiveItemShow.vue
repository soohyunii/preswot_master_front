<template>
  <div id="teacher_lecture_live_item_show_wrapper" class="bt-container">
    <el-row :gutter="20">
      <el-col span="11" style="margin: 0;">
        <h2>아이템 목록</h2>
        <el-table :data="itemList" height="540px" border="true" :row-class-name="tRCName">
          <el-table-column label="타입" prop="type" width="50px" />
          <el-table-column label="아이템 이름" prop="name" />
          <el-table-column label="그룹 번호" prop="group" width="80px" align="center" />
          <el-table-column label="순서 고정" prop="fix" width="80px" align="center" />
          <el-table-column label="" width="80px;">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="itemShow(scope.row)">
                보기
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col span="10" style="margin-left: 20px;">
        <div v-for="id in currentLectureItemId" :key="id">
          <teacher-lecture-live-item
            :lectureItemId="id"
            :onClick="onClick"
            :isAuto="isAuto"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import lectureService from '../../services/lectureService';
import authService from '../../services/authService';
import lectureItemService from '../../services/lectureItemService';
import TeacherLectureLiveItem from '../partials/TeacherLectureLiveItem';
import utils from '../../utils';

export default {
  name: 'TeacherLectureLiveItemShow',
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
    const grp = await lectureItemService.showGroup({
      lectureId: vm.lectureId,
    });
    const seq = await lectureItemService.showConnection({
      lectureId: vm.lectureId,
    });

    let groupNum = 0;
    grp.data.list.forEach((x) => {
      // 한 그룹별로
      groupNum += 1;
      x.list_ids.forEach((y) => {
        seq.data.forEach((z) => {
          // 그룹에 속하는 연결리스트 아이디에 대해
          if (parseInt(y, 10) === z.lecture_item_list_id) {
            // 연결리스트 아이템이 여러 개 - 아이템 고정
            if (z.linked_list.includes('<$!<>')) {
              const spl = z.linked_list.split('<$!<>');
              spl.forEach((w) => {
                // 연결리스트에 속하는 각 아이템에 대해
                const item = {};
                res.data.lecture_items.forEach((v) => {
                  if (parseInt(w, 10) === v.lecture_item_id) {
                    if (v.type === 0) {
                      item.type = '문항';
                    } else if (v.type === 1) {
                      item.type = '설문';
                    } else if (v.type === 2) {
                      item.type = '실습';
                    } else if (v.type === 3) {
                      item.type = '토론';
                    } else if (v.type === 4) {
                      item.type = '자료';
                    }
                    item.group = groupNum;
                    item.id = v.lecture_item_id;
                    item.name = v.name;
                    item.fix = 'O';
                  }
                });
                vm.itemList.push(item);
              });
            } else {
              // 연결리스트 아이템이 한 개 - 고정 X
              const item = {};
              res.data.lecture_items.forEach((v) => {
                if (parseInt(z.linked_list, 10) === v.lecture_item_id) {
                  if (v.type === 0) {
                    item.type = '문항';
                  } else if (v.type === 1) {
                    item.type = '설문';
                  } else if (v.type === 2) {
                    item.type = '실습';
                  } else if (v.type === 3) {
                    item.type = '토론';
                  } else if (v.type === 4) {
                    item.type = '자료';
                  }
                  item.group = groupNum;
                  item.id = v.lecture_item_id;
                  item.name = v.name;
                  item.fix = '';
                }
              });
              vm.itemList.push(item);
            }
          }
        });
      });
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
    itemShow(data) {
      const vm = this;
      vm.currentLectureItemId = [];
      vm.currentLectureItemId.push(data.id);
    },
  },
};
</script>

<style>
.el-table .odd {
  background: moccasin;
}
.el-table .even {
  background: powderblue;
}
</style>