<template>
  <div>
    <draggable v-model="lectureElementSequence" @start="drag=true" @end="drag=false">
      <template v-for="(item, index, key) in lectureElementSequence">
        <el-col :span="3" :key="key" align="center">
          <!-- TODO: change icons -->
          <!-- TODO: Translate tooltip -->
          <i :class="getIconsByType(item.type)" style="font-size: 50px;"></i>
          <i class="el-icon-error" style="color:red; vertical-align:top" @click="onClick(index)"></i><br/>
          <!-- TODO: change bg color, time variable -->
          <el-tag color="#DCDFE6">time</el-tag><br/>

          <!-- TODO: change bg color, duration variable -->
          <el-tag color="#F2F6FC">duration</el-tag><br/>
        </el-col>
      </template>    
    </draggable>
    
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import draggable from 'vuedraggable';

export default {
  data() {
    return {
      drag: false,
    };
  },
  name: 'LectureScenario',
  computed: {
    lectureElementSequence: {
      get() {
        return this.$store.state.teacher.lectureElementSequence;
      },
      set(value) {
        this.$store.commit('teacher/editLectureElement', { evt: value });
      },
    },
  },
  methods: {
    // TODO: edit lecture element
    // TODO: add drag/drop function
    ...mapMutations('teacher', ['deleteLectureElement']),
    ...mapMutations('teacher', ['editLectureElement']),
    onClick(index) {
      const vm = this;
      if (index < Object.keys(vm.lectureElementSequence).length) {
        vm.deleteLectureElement({
          lectureElementIndex: index,
        });
      }
      window.console.log(index);
    },
    getIconsByType(type) {
      let icon;
      switch (type) {
        case 'A': {
          icon = 'el-icon-question';
          break;
        }
        case 'B': {
          icon = 'el-icon-info';
          break;
        }
        case 'C': {
          icon = 'el-icon-document';
          break;
        }
        case 'D':
        default: {
          icon = 'el-icon-setting';
          break;
        }
      }
      return icon;
    },
  },
  components: {
    draggable,
  },
};
</script>
