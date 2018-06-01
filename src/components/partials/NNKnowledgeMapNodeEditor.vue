<template>
  <div>
    <el-table
      :data="nodes"
      border
      style="width: 500px">
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.value }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Weight" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index]">
            <div style="display:inline-block; width: 100px">
              <el-input type="number" step="1" v-model="nodes[scope.$index]._size" />
            </div>
            <el-button @click="onClick('saveNodeWeight', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            {{ scope.row._size }}<i class="el-icon-edit" @click="onClick('changeNodeWeight', scope.$index)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'KnowledgeMapNodeEditor',
  data() {
    return {
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('kMap', [
      'nodes',
    ]),
  },
  methods: {
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'changeNodeWeight': {
          // https://kr.vuejs.org/v2/guide/reactivity.html '배열의 변화를 감지하기 위해 직접 대입 대신 이 함수를 사용함'
          vm.inputFlag.splice(index, 1, true);
          break;
        }
        case 'saveNodeWeight': {
          const node = vm.nodes[index];
          // eslint-disable-next-line
          if (node._size < 1 || node._size > 100) {
            vm.$notify({
              title: '알림',
              message: '1 ~ 100 이내의 값을 입력해주세요.',
              type: 'warning',
            });
            vm.nodes[index]._size = 20; // eslint-disable-line
            break;
          }
          vm.inputFlag.splice(index, 1, false);
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
  },
};
</script>
