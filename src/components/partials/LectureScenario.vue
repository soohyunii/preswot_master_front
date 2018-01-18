<template>
  <div class="wrapper">
    <el-container>
      <el-aside width="39px">
        <span class="label" :style="getLabelStyle()">SCENARIO</span>
        <!-- <span class="label">SCENARIO</span> -->
      </el-aside>
      <el-main>
        <div ref="main">
          <el-row :gutter="10">
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
              <el-col :span="1" :key="key" align="center" v-if="index + 1 < Object.keys(lectureElementSequence).length">
                <br/><br/>
                <i class="el-icon-minus" style="font-size: 30px;"/>
              </el-col>
            </template>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@import "~@/variables.scss";

.wrapper {
  background-color: white;

  .label {
    font-size: 16px;
    font-weight: 600;
    padding: 2px 3px;
    color: white;
    background-color: $app-ultra-violet;
    writing-mode: vertical-lr;
    // height: 200px;
    text-align: center;
    transform: rotate(180);
    // width: 100%;
  }
}
</style>


<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'LectureScenario',
  data() {
    return {
      labelStyle: {
        height: '200px',
      },
    };
  },
  computed: {
    ...mapState('teacher', ['lectureScenario']),
  },
  methods: {
    // TODO: edit lecture element
    // TODO: add drag/drop function
    ...mapMutations('teacher', ['deleteLectureElement']),
    onClick(index) {
      const vm = this;
      if (index < Object.keys(vm.lectureScenario).length) {
        vm.deleteLectureElement({
          lectureElementIndex: index,
        });
      }
      window.console.log(index);
    },
    getIconsByType(type) {
      let icon;
      switch (type) {
        case '문제지': {
          icon = 'el-icon-question';
          break;
        }
        case '강의자료': {
          icon = 'el-icon-info';
          break;
        }
        case '숙제': {
          icon = 'el-icon-document';
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
      return icon;
    },
    getLabelStyle() {
      const main = this.$refs.main;
      const res = {};
      if (!main) {
        res.height = '200px';
      } else {
        res.height = `${main.clientHeight + 40}px`;
      }
      // this.$nextTick(() => {
      //   this.$forceUpdate();
      // });
      return res;
    },
  },
};
</script>
