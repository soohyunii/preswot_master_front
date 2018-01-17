<template>
  <el-aside width="150px">
    <template v-for="(item, key) in teachingClassList">
      <el-row :key="key">
        <el-col align="center">
          <!-- TODO: link to each class -->
          <el-button v-if="isCurrentClass(item)" type="info" disabled>
          <i :class="dummyIcons()" style="font-size: 50px;"></i><br/>
          {{ item.className | truncate(10) }}
          </el-button>
          <el-button @click="changeCurrentClass(item)" v-else>
          <i :class="dummyIcons()" style="font-size: 50px;"></i><br/>
          {{ item.className | truncate(10) }}
          </el-button>
        </el-col>
      </el-row>
    </template>

    <el-row>
      <el-col align="center">
        <!-- TODO: Implement adding lecture part -->
        <!-- TODO: translation -->
        <el-button @click="dummyAddClass()">
        <i class='el-icon-circle-plus' style="font-size: 50px;"></i><br/>
        과목 추가
        </el-button>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import teacherService from '../../services/teacherService';

export default {
  name: 'teachingClassList',
  computed: {
    ...mapState('teacher', ['teachingClassList', 'currentEditingClass']),
  },
  // TODO: Replace dummy functions
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingClass', 'updateTeachingClassList']),
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
    const classList = await teacherService.fetchTeachingClassList();
    vm.updateTeachingClassList({ classList });

    // 강사 메인화면 페이지 접속 직후 주시하는 과목 없는 경우 제일 첫번째 과목 정보 나타냄
    if (!vm.currentEditingClass && vm.teachingClassList) {
      vm.updateCurrentEditingClass({
        editingClass: vm.teachingClassList[0].className,
      });
    }

    vm.$emit('moveClass');
  },
};
</script>