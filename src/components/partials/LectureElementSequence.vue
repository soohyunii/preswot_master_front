<template>
  <div>
    Lecture Element Sequence Template <br />
    <el-row :gutter="10">
      <template v-for="(item, index, key) in lectureElementSequence">
        <el-col :span="4" :key="key" align="center">
          <!-- TODO: change icons -->
          <el-tag><i :class="getIconsByType(item.type)"/></el-tag><br/>
          <!-- TODO: change bg color, time variable -->
          <el-tag color="#C0C4CC">time</el-tag><br/>
          <!-- TODO: change bg color, duration variable -->
          <el-tag color="#F2F6FC">duration</el-tag><br/>
        </el-col>
        <el-col :span="1" :key="key" align="center" v-if="index + 1 < Object.keys(lectureElementSequence).length">
          <br/><br/>
          <i class="el-icon-minus" />
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LectureElementSequnce',
  computed: {
    ...mapState('teacher', ['lectureElementSequence']),
  },
  methods: {
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
        default:
        case 'D': {
          icon = 'el-icon-setting';
          break;
        }
      }
      return icon;
    },
  },
};
</script>
