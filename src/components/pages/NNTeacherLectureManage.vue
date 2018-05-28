<template>
  <div id="teacher_lecture_manage_wrapper" class="bt-container">
    <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > {{ lecture ? lecture.name : '' }}</h2>
    <!-- lecture id: {{ lectureId }} {{ lecture }}<br /> <br /> -->
    <!-- ddd {{ currentTeachingClass(classId) }}<br /> -->

    <el-tabs v-model="activeTab">
      <el-tab-pane label="기본 정보 수정" name="one">
        강의 기본 정보 수정 부분뷰<br />
        TODO: NNTeacherLectureNew 가져와야함
        근데 얘도 bt-container class 가지고 있는 애라
        적당히 분기해서 가져와야할듯? prop으로 먹이든, 아니면
        vm.$route.path.includes 'manage' 이걸로 하든, 아니면
        NNTeacherLectureNew의 속 부분을 partial로 따로 뺀다..? 근데 partial은 최대한 stateless하게 가고싶은데, 얘는 ... 어? 생각보다 stateless하네...? 근데 굳이 그렇게까지 해야하나 싶기도.<br />
        정리!!<br />
        prop으로는 아무것도 안넘김
        NNTeacherClassNew.computed.isEdit에서 했던 것처럼 path 기준으로 isManage 하나 만들어서 분기~
        isManage일때는 bt-container 클래스에서 빼고
        강의 추가 라고 되어있는 h2 숨기고~
        vm.getLecture() 불러서 lcStore.state.lecture에 있는 정보들 input에 넣어주고 하면 될 듯.

        <teacher-lecture-new />
      </el-tab-pane>
      <el-tab-pane label="강의 자료 및 키워드 등록" name="two">
        <el-row>
          <el-col :span="12">
            <h3>강의 자료 업로드</h3>
            <material-upload />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <h3>추천 키워드 <span style="font-weight: 400;">(오른쪽으로 드래그)</span></h3>
            <recommend-keywords />
          </el-col>
          <el-col :span="12">
            <h3>키워드 등록</h3>
            <lecture-keywords-editor />
          </el-col>
        </el-row>
        <div class="align-right">
          <el-button @click="onClick('SUBMIT_KEYWORDS')" type="primary">키워드 수정 완료</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="강의 아이템 등록" name="three">
        <div class="align-right">
          TODO: 자동 모드 toggle
        </div>
        <lecture-item-list
          @delete="onClickDeleteLectureItem"
          type="TEACHER"
          :list="lectureItemList"
        />
      </el-tab-pane>
      <el-tab-pane label="강의 허용 프로그램 설정" name="four">
        강의 허용 프로그램 설정 부분뷰
      </el-tab-pane>
      <el-tab-pane label="강의 지식맵 관리" name="five">
        강의 지식맵 관리 부분뷰
      </el-tab-pane>
      <el-tab-pane label="채점 관리" name="six">
        채점 관리 부분뷰
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import NNTeacherLectureNew from './NNTeacherLectureNew';
import MaterialUpload from '../partials/MaterialUpload';
import RecommendKeywords from '../partials/RecommendKeywords';
import LectureKeywordsEditor from '../partials/LectureKeywordsEditor';
import LectureItemList from '../partials/LectureItemList';
import utils from '../../utils';
import lectureItemService from '../../services/lectureItemService';


export default {
  name: 'TeacherLectureManage',
  components: {
    TeacherLectureNew: NNTeacherLectureNew,
    MaterialUpload,
    RecommendKeywords,
    LectureKeywordsEditor,
    LectureItemList,
  },
  data() {
    return {
      activeTab: 'three',
    };
  },
  async beforeMount() {
    const vm = this;
    // FIXME: TeacherClassShow의 그것이랑 동일한 문제 // getMyClassLists를 다른곳에서 불러서 이미 채워져있는경우면 사실 필요없음
    await vm.getMyClassLists();
    await vm.getClass({
      type: 'TEACHER',
      classId: vm.classId,
    });
    await vm.getLecture({ lectureId: vm.lectureId });
  },
  computed: {
    ...mapState('NNclass', [
      'teachingClassList',
    ]),
    ...mapGetters('NNclass', [
      'currentTeachingClass',
    ]),
    ...mapState('lc', [
      'lecture',
    ]),
    lectureItemList() {
      const lecture = this.$store.state.lc.lecture;
      if (lecture && Array.isArray(lecture.lecture_items)) {
        return lecture.lecture_items.map((x) => {
          x.type = utils.convertScType(x.type); // eslint-disable-line no-param-reassign
          return x;
        });
      }
      return [];
    },
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
    ...mapActions('NNclass', [
      'getMyClassLists',
      'getClass',
    ]),
    ...mapActions('lc', [
      'getLecture',
    ]),
    onClick(type, payload) { // eslint-disable-line
      // TODO: switch case 해서 SUBMIT_KEYWORDS 서버 전송
    },
    /**
     * 얘는 onClick에서 넘겨주면 index를 못받아와서 안됨
     */
    onClickDeleteLectureItem(index) {
      const vm = this;
      const targetLectureItem = vm.lectureItemList[index];

      console.log('targetLectureItem', targetLectureItem);
      vm.$confirm('정말로 이 아이템을 삭제하시겠습니까?', `${targetLectureItem.name || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            await lectureItemService.deleteLectureItem({
              lectureItemId: targetLectureItem.lecture_item_id,
            });
            // TODO: delete lectureItem from lecture.lecture_items
            vm.$notify({
              title: '삭제됨',
              message: '과목이 삭제됨',
              type: 'success',
              duration: 3000,
            });
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
            vm.$notify({
              title: '과목 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '과목 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#teacher_lecture_manage_wrapper {
  .align-right {
    text-align: right;
  }
}
</style>


