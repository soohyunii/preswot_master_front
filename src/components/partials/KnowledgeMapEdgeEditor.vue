<template>
  <div>
    <el-table
      :data="edges"
      border
      style="width: 500px">
      <template slot="append">
        <tr>
          <td width="500px" align="center">
            <div class="cell">
              <i class="el-icon-circle-plus-outline" @click="onClick('addEdge', edges.length + 1)" />
            </div>
          </td>
        </tr>
      </template>
      <el-table-column label="Sid" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].sid">
            <el-autocomplete
              class="inline-input"
              v-model="edges[scope.$index].sid"
              :fetch-suggestions="querySearch"
            />
            <el-button @click="onClick('changeEdgeSid', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row.sid }}<i class="el-icon-edit" @click="onClick('changeEdgeSid', scope.$index)" /></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Tid" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].tid">
            <el-autocomplete
              class="inline-input"
              v-model="edges[scope.$index].tid"
              :fetch-suggestions="querySearch"
            />
            <el-button @click="onClick('changeEdgeTid', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row.tid }}<i class="el-icon-edit" @click="onClick('changeEdgeTid', scope.$index)" /></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Weight" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].weight">
            <el-input type="number" v-model="edges[scope.$index].weight" />
            <el-button @click="onClick('changeEdgeWeight', scope.$index)">확인</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row.weight }}<i class="el-icon-edit" @click="onClick('changeEdgeWeight', scope.$index)" /></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    {{ edges }}
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'KnowledgeMapEdgeEditor',
  data() {
    return {
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('teacher', ['nodes', 'edges']),
  },
  methods: {
    ...mapMutations('teacher', ['updateEdges', 'addEdges', 'deleteEdges']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'addEdge': {
          vm.addEdges({ edge: { sid: `sid${index}`, tid: `tid${index}`, weight: 50 } });
          vm.inputFlag.push({ sid: false, tid: false, weight: false });
          break;
        }
        case 'changeEdgeSid': {
          vm.inputFlag[index].sid = !vm.inputFlag[index].sid;
          break;
        }
        case 'changeEdgeTid': {
          vm.inputFlag[index].tid = !vm.inputFlag[index].tid;
          break;
        }
        case 'changeEdgeWeight': {
          vm.inputFlag[index].weight = !vm.inputFlag[index].weight;
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
    querySearch(queryString, cb) {
      const vm = this;
      const links = this.nodes;
      const results = queryString ? links.filter(vm.createFilter(queryString)) : links;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) { // eslint-disable-next-line
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
  },
};
</script>