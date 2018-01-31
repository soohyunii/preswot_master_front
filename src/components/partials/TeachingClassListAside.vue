<template>
  <el-aside width="150px" id="teacher_class_list_aside">
    <el-row>
      <el-col
        align="center"
        v-for="(item, index) in teachingClassList"
        :key="index"
      >
        <!-- TODO: link to each class -->
        <el-tooltip
          effect="dark"
          :content="item.className"
          :disabled="item.className.length < truncateLength"
          placement="right"
          :open-delay="800"
        >
          <!-- TODO: currentClass 모습, 나머지 class 모습 바꾸기 -->
          <el-button
            class="class-btn"
            @click="changeCurrentClass(item)"
            :type="isCurrentClass(item) ? 'info' : ''"
          >
            <i :class="dummyIcons()" style="font-size: 50px;"></i>
            <br />
            {{ item.className | truncate(truncateLength) }}
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col align="center">
        <!-- TODO: Implement adding lecture part -->
        <!-- TODO: translation -->
        <el-button class="class-btn" @click="dummyAddClass()">
          <i class='el-icon-circle-plus' style="font-size: 50px;"></i> <br/>
          과목 추가
        </el-button>
      </el-col>
    </el-row>
  </el-aside>
</template>

<style lang="scss" scoped>
#teacher_class_list_aside {
  .class-btn {
    width: 120px;
    i {
      font-size: 50px;
    }
  }
}
</style>


<script>
import { mapState, mapMutations, mapActions } from 'vuex';
// import teacherService from '../../services/teacherService';

export default {
  name: 'teachingClassList',
  data() {
    return {
      truncateLength: 10,
    };
  },
  computed: {
    ...mapState('teacher', ['teachingClassList', 'currentEditingClass']),
  },
  // TODO: Replace dummy functions
  methods: {
    ...mapMutations('teacher', [
      'updateCurrentEditingClass',
    ]),
    ...mapActions('user', ['fetchMyClassLists']),
    dummyIcons() {
      // TODO: Replace icons of classes
      return 'el-icon-document';
    },
    dummyAddClass() {
      // TODO: Link to adding class page
    },
    isCurrentClass(item) {
      const vm = this;
      return item.className === vm.currentEditingClass;
    },
    changeCurrentClass(item) {
      const vm = this;
      const editingClass = item.className;
      vm.updateCurrentEditingClass({ editingClass });
      vm.$emit('moveClass');
    },
  },
  async mounted() {
    const vm = this;

    vm.fetchMyClassLists();
    // vm.testAction({
    //   scTitle: 'testACtionTitle',
    // });

    // const classList = await teacherService.fetchTeachingClassList();
    // console.log('classList', classList);
    // vm.updateTeachingClassList({ classList });
    // 강사 메인화면 페이지 접속 직후 주시하는 과목 없는 경우 제일 첫번째 과목 정보 나타냄
    // if (!vm.currentEditingClass && vm.teachingClassList) {
    //   vm.updateCurrentEditingClass({
    //     editingClass: vm.teachingClassList[0].className,
    //   });
    // }

    vm.$emit('moveClass');
  },
};
</script>