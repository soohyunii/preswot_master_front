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
              <i class="el-icon-circle-plus-outline" @click="onClick('addNode', nodes.length + 1)" />
            </div>
          </td>
        </tr>
      </template>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].name">
            <el-input v-model="nodes[scope.$index].name" width="80%"></el-input>
            <el-button @click="onClick('changeNodeName', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row.name }}<i class="el-icon-edit" @click="onClick('changeNodeName', scope.$index)" /></span>
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
      addNodeItem: { name: 'addNodeItem', weight: 0 },
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('teacher', ['nodes']),
  },
  methods: {
    ...mapMutations('teacher', ['updateNodes', 'addNodes', 'deleteNodes']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'addNode': {
          vm.addNodes({ node: { name: `노드 이름${index}`, weight: 50 } });
          vm.inputFlag.push({ name: false, weight: false });
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