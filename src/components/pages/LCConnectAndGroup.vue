<template>
  <div id="lc_connect_and_group" class="bt-container">
    <h2>
      아이템 연결하기
      <el-popover
        style="position: relative; left: 30px; top: 3px;"
        placement="top-start"
        width="600"
        trigger="hover">
        <el-table :data="notice">
          <el-table-column width="120" property="title" label="상태"></el-table-column>
          <el-table-column width="480" property="content" label="내용"></el-table-column>
        </el-table>
        <i class="el-icon-question fa-lg" slot="reference"></i>
      </el-popover>
    </h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="아이템 연결" name="connect">
        <lecture-item-connect />
      </el-tab-pane>
      <el-tab-pane label="아이템 그룹화" name="group">
        <lecture-item-group />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LectureItemConnect from '../pages/LectureItemConnect';
import LectureItemGroup from '../pages/LectureItemGroup';

export default {
  name: 'LCConnectAndGroup',
  components: {
    LectureItemConnect,
    LectureItemGroup,
  },
  data() {
    return {
      activeTab: 'connect',
      notice: [{ // 강사용 도움말
        title: '아이템 연결',
        content: '순서를 유지시킬 아이템들을 선택할 수 있습니다. ' +
                  '함께 연결된 아이템들은 셔플되지 않고 그 순서가 유지됩니다. ' +
                  '아이템 연결 작업이 모두 끝난 뒤 그룹화를 진행해 주세요.',
      }, {
        title: '아이템 그룹화',
        content: '강사가 "아이템 보이기"를 할 경우 같은 그룹에 속한 아이템들은 순서가 랜덤하게 ' +
                  '섞여 같이 보여집니다. 그룹이 설정되지 않은 아이템은 단독으로 보여집니다. ' +
                  '연결되어 있는 아이템은 순서가 유지됩니다.',
      }],
    };
  },
  computed: {
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.lectureId, 10);
    },
  },
  methods: {
    handleClick(tab, event) {
      const vm = this;
      if (vm.activeTab === 'connect') {
        vm.activeTab = 'group';
      } else {
        vm.activeTab = 'connect';
      }
      window.location.reload(true);
    }
  }
}
</script>