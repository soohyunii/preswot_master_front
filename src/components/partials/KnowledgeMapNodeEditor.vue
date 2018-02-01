<template>
  <div>
    <el-table
      :data="nodes"
      border
      style="width: 500px">
      <template slot="append">
        <tr>
          <td width="500px" align="center">
            <div class="cell">
              <i class="el-icon-circle-plus-outline" @click="onClick('addNode')" />
            </div>
          </td>
        </tr>
      </template>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].value">
            <el-input v-model="nodes[scope.$index].value" @focus="currentIndex = scope.$index"/>
            <el-button @click="onClick('setNodeName', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row.value }}<i class="el-icon-edit" @click="onClick('changeNodeName', scope.$index)" /></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Weight" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].weight">
            <el-input type="number" v-model="nodes[scope.$index]._size" />
            <el-button @click="onClick('changeNodeWeight', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row._size }}<i class="el-icon-edit" @click="onClick('changeNodeWeight', scope.$index)" /></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onClick('delete', scope.$index)">
            delete
          </el-button>
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
      currentIndex: -1,
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('teacher', ['nodes', 'edges']),
  },
  methods: {
    ...mapMutations('teacher', ['addNodes', 'deleteNodes']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'addNode': {
          vm.addNodes({ node: { value: '', _size: 10 } });
          vm.inputFlag.push({ value: true, weight: false });
          break;
        }
        case 'changeNodeName': {
          vm.inputFlag[index].value = !vm.inputFlag[index].value;
          break;
        }
        case 'changeNodeWeight': {
          vm.inputFlag[index].weight = !vm.inputFlag[index].weight;
          break;
        }
        case 'setNodeName': {
          const node = vm.nodes[index];
          if (node.value === '') { // eslint-disable-next-line
            alert('empty not allowed');
            break;
          } else if (vm.nodes.findIndex(vm.isDuplicated) !== -1) {
            // eslint-disable-next-line
            alert('duplicated node');
            break;
          }
          vm.nodes[index].id = vm.nodes[index].value;
          vm.nodes[index].name = vm.nodes[index].value;
          vm.inputFlag[index].value = !vm.inputFlag[index].value;
          break;
        }
        case 'delete': {
          vm.deleteNodes({ nodeIndex: index });
          vm.inputFlag.splice(index, 1);
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
    isDuplicated(element, index) {
      const vm = this;
      if (index !== vm.currentIndex && element.id === vm.nodes[vm.currentIndex].value) {
        return element;
      }
      return false;
    },
  },
};
</script>