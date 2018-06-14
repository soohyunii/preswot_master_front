<template>
  <div id="teacher_lecture_live_wrapper" class="bt-container">
    NN teacher lecture live template,<br />
    lecture id : {{ lectureId }}<br />
    lectureItemIdList : {{ lectureItemIdList }}<br />
    tableItemList : {{ tableItemList }}<br />
    <el-row>
      <el-col :span="24"><div class="bg-purple-light">여기는 강의제목이 들어갈 곳입니다. lecture id : {{ lectureId }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <youtube-video />
      </el-col>
      <el-col :span="12">
        <teacher-lecture-item-live        
        v-if="lectureItemIdList[0] !== -1"
        :lectureItemId="lectureItemIdList[0]"
        :onClick="onClick"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <teacher-lecture-item-list-live
        :dataList="tableItemList"
        :onClick="onClick"/>
      </el-col>
      <el-col :span="12">
        <teacher-lecture-item-live        
        v-if="lectureItemIdList[1] !== -1"
        :lectureItemId="lectureItemIdList[1]"
        :onClick="onClick"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import lectureService from '../../services/lectureService';
import YoutubeVideo from '../partials/YoutubeVideo';
import TeacherLectureItemListLive from '../partials/TeacherLectureItemListLive';
import TeacherLectureItemLive from '../partials/TeacherLectureItemLive';

export default {
  name: 'TeacherLectureLive',
  async created() {
    const vm = this;
    const res = await lectureService.getLecture({
      lectureId: vm.$route.params.lectureId,
    });
    vm.tableItemList = res.data.lecture_items;
  },
  data() {
    return {
      tableItemList: [],
      lectureItemIdList: [-1, -1],
    };
  },
  computed: {
    lectureId() {
      const vm = this;
      return vm.$route.params.lectureId;
    },
  },
  components: {
    YoutubeVideo,
    TeacherLectureItemListLive,
    TeacherLectureItemLive,
  },
  methods: {
    onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'SHOW': {
          const index = vm.lectureItemIdList.indexOf(-1);
          if (index === -1) {
            console.log('빈 슬롯이 없습니다. 먼저 슬롯을 확보하세요.');
            break;
          }
          if (vm.lectureItemIdList.indexOf(data) !== -1) {
            console.log('이미 추가된 항목입니다. 먼저 슬롯을 확인하세요.');
            break;
          }
          vm.lectureItemIdList.splice(index, 1, data);
          break;
        }
        case 'HIDE': {
          const index = vm.lectureItemIdList.indexOf(data);
          if (index === -1) {
            console.log('이미 삭제된 항목입니다.');
            break;
          }
          vm.lectureItemIdList.splice(index, 1, -1);
          break;
        }
        case 'SUBMIT': {
          console.log('onClick(SUBMIT) 이벤트 발생');
          console.log('data = ', data);
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

<style>
.el-row {
  margin-bottom: 20px;
}
.grid-content {
  border-radius: 4px;
  min-height: 500px;
}
.bg-purple-light {
  background: #e5e9f2;
}
</style>