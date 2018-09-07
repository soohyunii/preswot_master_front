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
  props: ['drawNetwork'],
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
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'changeEdgeWeight': {
          vm.checkAndCreateInputFlag(index);
          vm.inputFlag[index] = true;
          break;
        }
        case 'saveEdgeWeight': {
          vm.inputFlag.splice(index, 1, false);
          break;
        }
        case 'delete': {
          vm.deleteLectureKeywordRelation({ index, lectureId: vm.$route.params.lectureId });
          vm.inputFlag.splice(index, 1);
          vm.drawNetwork();
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