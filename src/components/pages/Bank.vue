<template>
  <div id="bank" class="bt-container" style="margin: 0 auto;">
    <h1>강의 은행</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="과목 저장소" name="class">
        <bank-class />
      </el-tab-pane>
      <el-tab-pane label="강의 저장소" name="lecture">
        <bank-lecture />
      </el-tab-pane>
      <el-tab-pane label="강의 아이템 저장소" name="item">
        <bank-lecture-item />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BankClass from '../partials/BankClass';
import BankLecture from '../partials/BankLecture';
import BankLectureItem from '../partials/BankLectureItem';


export default {
  name: 'Bank',
  components: {
    BankClass,
    BankLecture,
    BankLectureItem,
  },
  data() {
    return {
      activeTab: 'class',
    };
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