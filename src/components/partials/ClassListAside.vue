<template>
  <el-aside width="150px" class="class_list_aside">
    <el-row>
      <el-col
        align="center"
        v-for="(item, index) in classList"
        :key="index"
      >
        <!-- {{ item }} -->
        <!-- {{ isCurrentClass(item, index) }} {{ index }} {{ currentClassIndex }} -->
        <!-- TODO: link to each class -->
        <el-tooltip
          effect="dark"
          :content="item.name"
          :disabled="1 < truncateLength"
          placement="right"
          :open-delay="800"
        >
          <!-- TODO: currentClass 모습, 나머지 class 모습 바꾸기 -->
          <el-button
            class="class-btn"
            @click="clickClassButton(item, index)"
            :type="isCurrentClass(item, index) ? 'info' : ''"
          >
            <i class="el-icon-document" style="font-size: 50px;"></i>
            <br />
            {{ item.name | truncate(truncateLength) }}
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col align="center" v-if="type === 'TEACH'">
        <!-- TODO: Implement adding lecture part -->
        <!-- TODO: translation -->
        <el-button v-if="type === 'TEACH'" class="class-btn" @click="clickAddButton()">
          <i class='el-icon-circle-plus' style="font-size: 50px;"></i> <br/>
          과목 추가
        </el-button>
      </el-col>
    </el-row>
  </el-aside>
</template>

<style lang="scss" scoped>
.class_list_aside {
  padding-top: 20px;
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
  name: 'ClassListAside',
  props: ['type'],
  data() {
    return {
      truncateLength: 10,
    };
  },
  computed: {
    ...mapState('class', [
      'currentClassIndex',
      'teachingClassList',
      'studyingClassList',
    ]),
    classList() {
      const vm = this;
      const { type } = vm;
      switch (type) {
        case 'TEACH': {
          return vm.teachingClassList;
        }
        case 'STUDY': {
          return vm.studyingClassList;
        }
        default: {
          throw new Error(`not defined class type ${type}`);
        }
      }
    },
  },
  methods: {
    ...mapMutations('class', [
      'updateCurrentClassIndex',
    ]),
    ...mapActions('class', [
      'getMyClassLists',
    ]),
    clickAddButton() {
      const vm = this;
      vm.$router.push('/a/teacher/class/new');
    },
    isCurrentClass(item, index) {
      const vm = this;
      if (vm.currentClassIndex === null) {
        return false;
      }
      return index === vm.currentClassIndex; // TODO: currentClass id
    },
    clickClassButton(item, index) {
      const vm = this;
      vm.updateCurrentClassIndex({
        currentClassIndex: index,
      });
    },
  },

  async beforeMount() {
    const vm = this;

    await vm.getMyClassLists();
    // await vm.$nextTick();
    // vm.$forceUpdate();

    // const classList = await teacherService.fetchTeachingClassList();
    // console.log('classList', classList);
    // vm.updateTeachingClassList({ classList });
    // 강사 메인화면 페이지 접속 직후 주시하는 과목 없는 경우 제일 첫번째 과목 정보 나타냄
    // if (!vm.currentEditingClass && vm.teachingClassList) {
    //   vm.updateCurrentEditingClass({ // TODO: delete updateCurrentEditingClass
    //     editingClass: vm.teachingClassList[0].className,
    //   });
    // }
  },
};
</script>