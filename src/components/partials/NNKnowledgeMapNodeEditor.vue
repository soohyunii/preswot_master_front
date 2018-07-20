<template>
  <div>
    <el-table
      :data="nodes"
      border
      :header-cell-style="changeHead"
      style="width: 500px">
      <el-table-column label="키워드" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.label }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="중요도" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index]">
            <div style="display:inline-block; width: 100px">
              <el-input type="number" step="1" v-model="newWeight[scope.$index]" />
            </div>
            <el-button @click="onClick('saveNodeWeight', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            {{ scope.row.weight }}<i class="el-icon-edit" @click="onClick('changeNodeWeight', scope.$index)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'KnowledgeMapNodeEditor',
  data() {
    return {
      inputFlag: [],
      newWeight: [],
    };
  },
  computed: {
    ...mapState('kMap', [
      'nodes',
      'drawFlag',
    ]),
    reDrawFlag() {
      const vm = this;
      return vm.drawFlag;
    },
  },
  methods: {
    ...mapMutations('kMap', ['updateDrawFlag']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'changeNodeWeight': {
          // https://kr.vuejs.org/v2/guide/reactivity.html '배열의 변화를 감지하기 위해 직접 대입 대신 이 함수를 사용함'
          vm.checkAndCreateInputFlag(index);
          vm.inputFlag.splice(index, 1, true);
          break;
        }
        case 'saveNodeWeight': {
          const node = vm.nodes[index];
          // eslint-disable-next-line
          if (node.weight < 1 || node.weight > 100) {
            vm.$notify({
              title: '알림',
              message: '1 ~ 100 이내의 값을 입력해주세요.',
              type: 'warning',
            });
            vm.nodes[index].weight = 20; // eslint-disable-line
            break;
          }
          vm.nodes[index].weight = vm.newWeight[index];
          vm.nodes[index].color = vm.updateNodeColor(vm.newWeight[index]);
          vm.newWeight[index] = null;
          vm.updateDrawFlag(!vm.reDrawFlag);
          vm.inputFlag.splice(index, 1, false);
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
    checkAndCreateInputFlag(index) {
      const vm = this;
      if (vm.inputFlag[index] === undefined) {
        vm.inputFlag[index] = null;
        vm.inputFlag.splice(index, 1);
      }
    },
    updateNodeColor(weight) {
      let color = '#E4F1F6';
      if (weight > 75) {
        color = '#1A3E4C';
      } else if (weight > 50) {
        color = '#347B98';
      } else if (weight > 25) {
        color = '#67AFCB';
      }
      return color;
    },
    changeHead() {
      return { backgroundColor: '#ebeef5' };
    },
  },
};
</script>
