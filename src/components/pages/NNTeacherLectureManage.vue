<template>
  <div id="teacher_lecture_manage_wrapper" class="bt-container">
    <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > {{ lecture ? lecture.name : '' }}</h2>
    <!-- lecture id: {{ lectureId }} {{ lecture }}<br /> <br /> -->
    <!-- ddd {{ currentTeachingClass(classId) }}<br /> -->
    isEditing: {{ isEditing }} <br />

    <el-tabs v-model="activeTab" :before-leave="beforeLeaveTab">
      <el-tab-pane label="기본 정보 수정" name="one">
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
        <!-- 존나 신기하게 functional component는 v-show를 안먹는다 -->
        <div v-show="!isEditing">
          <lecture-item-list
            v-show="null"
            @delete="onClickDeleteLectureItem"
            @edit="onClickEditLectureItem"
            type="TEACHER"
            :list="lectureItemList"
          />
        </div>
        <div v-show="isEditing">
          <el-button @click="TODOdeleteClick">TODO: Delete this el-button and click listener</el-button>
        </div>
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
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
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
    await vm.getKeywords();
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
    ...mapGetters('lcItem', [
      'isEditing',
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
    ...mapMutations('lcItem', [
      'updateCurrentEditingLectureItemId',
      'updateLectureItem',
    ]),
    ...mapActions('NNclass', [
      'getMyClassLists',
      'getClass',
    ]),
    ...mapActions('lc', [
      'getLecture',
      'deleteLectureKeywords',
      'postLectureKeywords',
      'getKeywords',
    ]),
    TODOdeleteClick() {
      this.updateCurrentEditingLectureItemId({
        currentEditingLectureItemId: null,
      });
    },
    beforeLeaveTab() {
      if (this.activeTab === 'three') { // 강의 아이템 등록에서 떠나려는 경우
        this.updateCurrentEditingLectureItemId({
          currentEditingLectureItemId: null,
        });
        this.updateLectureItem({
          lectureItem: null,
        });
      }
      return true; // false인 경우 탭 전환 안됨
    },
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'SUBMIT_KEYWORDS': {
          vm.deleteLectureKeywords();
          vm.postLectureKeywords();
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    onClickEditLectureItem(lectureItemId) {
      console.log('lectureItemId', lectureItemId); // eslint-disable-line
      this.updateCurrentEditingLectureItemId({
        currentEditingLectureItemId: lectureItemId,
      });
    },
    /**
     * 얘는 onClick에서 넘겨주면 index를 못받아와서 안됨
     */
    onClickDeleteLectureItem(index) {
      const vm = this;
      const targetLectureItem = vm.lectureItemList[index];

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


