<template>
  <div>
    <el-table
      :data="edges"
      border
      style="width: 600px">
      <template slot="append">
        <tr>
          <td width="600px" align="center">
            <div class="cell">
              <i class="el-icon-circle-plus-outline" @click="onClick('addEdge')" />
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
            {{ scope.row.sid }}<i class="el-icon-edit" @click="onClick('changeEdgeSid', scope.$index)" />
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
            {{ scope.row.tid }}<i class="el-icon-edit" @click="onClick('changeEdgeTid', scope.$index)" />
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
            {{ scope.row.weight }}<i class="el-icon-edit" @click="onClick('changeEdgeWeight', scope.$index)" />
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
  name: 'KnowledgeMapEdgeEditor',
  data() {
    return {
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('sc', ['nodes']),
    edges: {
      get() {
        return this.$store.state.sc.edges;
      },
      set(edges) {
        const vm = this;
        if (edges) {
          vm.updateEdges({ edges });
        }
      },
    },
  },
  methods: {
    ...mapMutations('sc', [
      'pushEdge',
      'updateEdges',
      'deleteEdge',
    ]),
    isValidEdge(sidInputFlag, tidInputFlag, index) {
      const vm = this;
      let isValid = true;

      if (sidInputFlag && tidInputFlag) {
        return isValid;
      }

      const inputSid = vm.edges[index].sid;
      const inputTid = vm.edges[index].tid;
      if (inputSid === inputTid) {
        // TODO: translate
        vm.$notify({
          title: 'Equal',
          message: 'source, target 다르게 좀...',
          type: 'warning',
        });
        isValid = false;
      }

      vm.edges.forEach((edge, idx) => {
        const isInputing = vm.inputFlag[idx].sid || vm.inputFlag[idx].tid;
        const isMe = idx === index;
        if (!isMe && !isInputing) {
          const isduplicatedEdge = edge.sid === inputSid && edge.tid === inputTid;
          // const isduplicatedReverseEdge = edge.tid === inputSid && edge.sid === inputTid;
          // if (isduplicatedEdge || isduplicatedReverseEdge) {
          if (isduplicatedEdge) {
            // TODO: translate
            vm.$notify({
              title: 'Duplicated',
              message: '이미 Edge가 존재하네요...',
              type: 'warning',
            });
            isValid = false;
          }
        }
      });

      return isValid;
    },
    isValidEdgeId(id) {
      const vm = this;

      // Case of Empty value
      if (!id) {
        // TODO: transalte
        vm.$notify({
          title: 'Empty',
          message: '입력값 필쑤..',
          type: 'warning',
        });
        return false;
      }

      // Value is not in nodes(vuex)
      const nodesNames = [];
      for (let i = 0; i < vm.nodes.length; i += 1) {
        nodesNames.push(vm.nodes[i].name);
      }
      if (!nodesNames.includes(id)) {
        // TODO: transalte
        vm.$notify({
          title: 'Empty',
          message: 'Node에 존재하는 값으로 좀..',
          type: 'warning',
        });
        return false;
      }

      return true;
    },
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'addEdge': {
          vm.pushEdge({ edge: { sid: '', tid: '', weight: 50 } });
          vm.inputFlag.push({ sid: true, tid: true, weight: false });
          break;
        }
        case 'changeEdgeSid': {
          if (!vm.isValidEdgeId(vm.edges[index].sid)) {
            break;
          }
          const sidInputFlag = vm.inputFlag[index].sid;
          const tidInputFlag = vm.inputFlag[index].tid;
          if (vm.isValidEdge(sidInputFlag, tidInputFlag, index)) {
            vm.inputFlag[index].sid = !vm.inputFlag[index].sid;
          }
          break;
        }
        case 'changeEdgeTid': {
          if (!vm.isValidEdgeId(vm.edges[index].tid)) {
            break;
          }
          const sidInputFlag = vm.inputFlag[index].sid;
          const tidInputFlag = vm.inputFlag[index].tid;
          if (vm.isValidEdge(sidInputFlag, tidInputFlag, index)) {
            vm.inputFlag[index].tid = !vm.inputFlag[index].tid;
          }
          break;
        }
        case 'changeEdgeWeight': {
          vm.inputFlag[index].weight = !vm.inputFlag[index].weight;
          break;
        }
        case 'delete': {
          vm.deleteEdge({ edgeIndex: index });
          vm.inputFlag.splice(index, 1);
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
  async mounted() {
    const vm = this;
    await vm.$nextTick();
    vm.edges.forEach(() => {
      vm.inputFlag.push({ sid: false, tid: false, weight: false });
    });
  },
};
</script>