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
            <el-input v-model="nodes[scope.$index].name"/>
            <el-button @click="onClick('setNodeName', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            {{ scope.row.value }}<i class="el-icon-edit" @click="onClick('changeNodeName', scope.$index)" />
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
            {{ scope.row._size }}<i class="el-icon-edit" @click="onClick('changeNodeWeight', scope.$index)" />
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
    {{ nodes }}
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Guid from 'guid';

export default {
  name: 'KnowledgeMapNodeEditor',
  data() {
    return {
      currentIndex: -1,
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('teacher', ['nodes']),
  },
  methods: {
    ...mapMutations('teacher', ['addNodes', 'deleteNodes']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'addNode': {
          const id = Guid.create().toString();
          vm.addNodes({ node: { id, value: '', _size: 20 } });
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
          vm.currentIndex = index;
          if (node.name === '') {
            // TODO: translate
            vm.$notify({
              title: 'Equal',
              message: '입력값 필쑤..',
              type: 'warning',
            });
            break;
          } else if (vm.nodes.findIndex(vm.isDuplicated) !== -1) {
            // TODO: translate
            vm.$notify({
              title: 'Equal',
              message: '이미 Node가 존재하네요...',
              type: 'warning',
            });
            break;
          }
          vm.nodes[index].value = vm.nodes[index].name;
          vm.nodes[index].id = vm.nodes[index].name;
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
      if (index !== vm.currentIndex && element.id === vm.nodes[vm.currentIndex].name) {
        return element;
      }
      return false;
    },
  },
  async mounted() {
    const vm = this;
    await vm.$nextTick();
    vm.nodes.forEach(() => {
      vm.inputFlag.push({ value: false, weight: false });
    });
  },
};
</script>