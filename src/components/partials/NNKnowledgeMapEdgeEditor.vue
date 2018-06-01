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
            <el-button @click="onClick('saveEdgeSid', scope.$index)">확인</el-button>
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
            <el-button @click="onClick('saveEdgeTid', scope.$index)">확인</el-button>
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
            <el-button @click="onClick('saveEdgeWeight', scope.$index)">확인</el-button>
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'KnowledgeMapEdgeEditor',
  data() {
    return {
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('kMap', ['nodes', 'edges']),
  },
  methods: {
    ...mapActions('kMap', [
      'deleteLectureKeywordRelation',
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
          title: '알림',
          message: 'Source ID와 Target ID는 같을 수 없습니다.',
          type: 'warning',
        });
        isValid = false;
      }

      vm.edges.forEach((edge, idx) => {
        const isMe = idx === index;
        if (!isMe) {
          const isduplicatedEdge = edge.sid === inputSid && edge.tid === inputTid;
          // const isduplicatedReverseEdge = edge.tid === inputSid && edge.sid === inputTid;
          // if (isduplicatedEdge || isduplicatedReverseEdge) {
          if (isduplicatedEdge) {
            // TODO: translate
            vm.$notify({
              title: '알림',
              message: '입력한 edge와 일치하는 edge가 이미 존재합니다.',
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
          title: '알림',
          message: '값을 입력해주세요.',
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
          title: '알림',
          message: 'Name에 존재하는 값을 입력해야 합니다.',
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
          vm.edges.push({ sid: '', tid: '', weight: 50 });
          break;
        }
        case 'changeEdgeSid': {
          vm.checkAndCreateInputFlag(index);
          vm.inputFlag[index].sid = true;
          break;
        }
        case 'saveEdgeSid': {
          if (!vm.isValidEdgeId(vm.edges[index].sid)) {
            break;
          }
          const sidInputFlag = vm.inputFlag[index].sid;
          const tidInputFlag = vm.inputFlag[index].tid;
          if (!vm.isValidEdge(sidInputFlag, tidInputFlag, index)) {
            break;
          }
          vm.inputFlag[index].sid = false;
          break;
        }
        case 'changeEdgeTid': {
          vm.checkAndCreateInputFlag(index);
          vm.inputFlag[index].tid = true;
          break;
        }
        case 'saveEdgeTid': {
          if (!vm.isValidEdgeId(vm.edges[index].tid)) {
            break;
          }
          const sidInputFlag = vm.inputFlag[index].sid;
          const tidInputFlag = vm.inputFlag[index].tid;
          if (!vm.isValidEdge(sidInputFlag, tidInputFlag, index)) {
            break;
          }
          vm.inputFlag[index].tid = false;
          break;
        }
        case 'changeEdgeWeight': {
          vm.checkAndCreateInputFlag(index);
          vm.inputFlag[index].weight = true;
          break;
        }
        case 'saveEdgeWeight': {
          vm.inputFlag[index].weight = false;
          break;
        }
        case 'delete': {
          vm.deleteLectureKeywordRelation({ index, lectureId: vm.$route.params.lectureId });
          vm.inputFlag.splice(index, 1);
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
        vm.inputFlag.splice(index, 1, { sid: false, tid: false, weight: false });
      }
    },
    querySearch(queryString, cb) {
      const vm = this;
      const links = vm.nodes;
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
  /*
  async mounted() {
    const vm = this;
    await vm.$nextTick();
    vm.edges.forEach(() => {
      vm.inputFlag.push({ sid: false, tid: false, weight: false });
    });
  },
  */
};
</script>