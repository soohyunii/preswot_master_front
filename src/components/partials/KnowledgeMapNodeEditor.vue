<template>
  <div>
    <el-table
      :data="nodes"
      :span-method="arraySpanMethod"
      border
      style="width: 30%">
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].name">
            <el-input v-model="nodes[scope.$index].name"></el-input>
            <el-button @click="onClick('changeNodeName', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <i v-if="scope.row.name === 'addNodeItem'" class="el-icon-circle-plus-outline" @click="onClick('addNode', scope.$index)" />
            <span v-else>{{ scope.row.name }}<i class="el-icon-edit" @click="onClick('changeNodeName', scope.$index)" /></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Weight" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].weight">
            <el-input v-model="nodes[scope.$index].weight"></el-input>
            <el-button @click="onClick('changeNodeWeight', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row.weight }}<i class="el-icon-edit" @click="onClick('changeNodeWeight', scope.$index)" /></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    {{ nodes }}
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'KnowledgeMapNodeEditor',
  data() {
    return {
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('teacher', ['nodes', 'edges']),
  },
  methods: {
    ...mapMutations('teacher', ['updateNodes', 'addNodes', 'deleteNodes', 'updateEdges']),
    arraySpanMethod({ rowIndex, columnIndex }) {
      const vm = this;
      if (rowIndex === vm.nodes.length - 1) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
      return [1, 1];
    },
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'addNode': {
          vm.deleteNodes({ nodeIndex: vm.nodes.length - 1 });
          vm.addNodes({ node: { name: `노드 이름${index}`, weight: 0 } });
          vm.addNodes({ node: { name: 'addNodeItem' } });
          vm.inputFlag.push({ name: false, weight: false });
          vm.updateEdges({ edges: vm.edges });
          break;
        }
        case 'changeNodeName': {
          vm.inputFlag[index].name = !vm.inputFlag[index].name;
          break;
        }
        case 'changeNodeWeight': {
          vm.inputFlag[index].weight = !vm.inputFlag[index].weight;
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