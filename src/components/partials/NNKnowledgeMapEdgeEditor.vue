<template>
  <div>
    <el-table
      :data="edges"
      border
      style="width: 600px">
      <el-table-column label="From" align="center">
        <template slot-scope="scope">
          <!-- <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].sid">
            <el-autocomplete
              class="inline-input"
              v-model="edges[scope.$index].sid"
              :fetch-suggestions="querySearch"
            />
            <el-button @click="onClick('saveEdgeSid', scope.$index)">확인</el-button>
          </div> -->
          <div>
            {{ scope.row.from }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="To" align="center">
        <template slot-scope="scope">
          <!-- <div v-if="inputFlag[scope.$index] && inputFlag[scope.$index].tid">
            <el-autocomplete
              class="inline-input"
              v-model="edges[scope.$index].tid"
              :fetch-suggestions="querySearch"
            />
            <el-button @click="onClick('saveEdgeTid', scope.$index)">확인</el-button>
          </div> -->
          <div>
            {{ scope.row.to }}
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
    onClick(type, index) {
      const vm = this;
      switch (type) {
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