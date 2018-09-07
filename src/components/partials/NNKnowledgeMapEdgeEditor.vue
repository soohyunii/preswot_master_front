<template>
  <div>
    <el-table
      :data="edges"
      border
      :header-cell-style="changeHead"
      style="width: 600px">
      <el-table-column label="From" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.from }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="To" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.to }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="중요도" align="center">
        <template slot-scope="scope">
          <div v-if="inputFlag[scope.$index]">
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
          <el-button size="mini" type="danger" @click="onClick('delete', scope.row.from, scope.row.to)">
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
  props: ['drawNetwork', 'edgeData'],
  data() {
    return {
      inputFlag: [],
    };
  },
  computed: {
    ...mapState('kMap', ['edges']),
  },
  methods: {
    ...mapActions('kMap', [
      'deleteLectureKeywordRelation',
    ]),
    async onClick(type, data1, data2) {
      const vm = this;
      switch (type) {
        case 'changeEdgeWeight': {
          vm.checkAndCreateInputFlag(data1);
          vm.inputFlag[data1] = true;
          break;
        }
        case 'saveEdgeWeight': {
          vm.inputFlag.splice(data1, 1, false);
          break;
        }
        case 'delete': {
          const index = vm.edges.findIndex(item => item.from === data1 && item.to === data2);
          vm.edgeData.remove(vm.edges[index].id);
          await vm.deleteLectureKeywordRelation({ index, lectureId: vm.$route.params.lectureId });
          vm.inputFlag.splice(data1, 1);
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
    changeHead() {
      return { backgroundColor: '#ebeef5' };
    },
  },
};
</script>