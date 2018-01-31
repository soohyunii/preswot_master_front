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
            <el-form :model="nodes[scope.$index]" :rules="rules" ref="ruleForm" class="demo-ruleForm">
              <el-form-item prop="name">
                <el-input v-model="nodes[scope.$index].value" />
              </el-form-item>
              <el-form-item>
                <el-button @click="onClick('changeNodeName', scope.$index)">확인</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <span>{{ scope.row.value }}<i class="el-icon-edit" @click="onClick('changeNodeName', scope.$index)" /></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Weight" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].weight">
            <el-input type="number" v-model="nodes[scope.$index].weight" />
            <el-button @click="onClick('changeNodeWeight', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row.weight }}<i class="el-icon-edit" @click="onClick('changeNodeWeight', scope.$index)" /></span>
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

export default {
  name: 'KnowledgeMapNodeEditor',
  data() {
    return {
      inputFlag: [],
      count: 1,
      rules: {
        name: {
          required: true,
          message: 'required',
          trigger: 'change, blur',
        },
      },
    };
  },
  computed: {
    ...mapState('teacher', ['nodes', 'edges']),
  },
  methods: {
    ...mapMutations('teacher', ['updateNodes', 'updateEdges', 'addNodes', 'deleteNodes']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'addNode': {
          vm.addNodes({ node: { value: `노드 이름${vm.count}`, weight: 50 } });
          vm.inputFlag.push({ value: false, weight: false });
          vm.count += 1;
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
        case 'delete': {
          vm.deleteNodes({ nodeIndex: index });
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