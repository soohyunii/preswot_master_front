<template>
  <div class="wrapper" ref="wrapper">
      <!-- 디버그 용도
      <p>{{ nodes }}</p>
      <p>{{ edges }}</p> -->

      <!-- TODO 키워드 추출 부분 수정 후 작성할 것
      <div v-if="false">
        <br /><br />
        키워드 추출 진행중 <i class="el-icon-loading"> </i><br />
        다른 작업은 삼가 주세요.
      </div>
      -->
      <div class="networkVis" id="myNetwork"></div>
      <!-- <el-button type="success" @click="fit">그래프 전체보기 <i class="el-icon-zoom-out"></i></el-button> -->
      <br>
      <el-row>
        <div class="ps-align-right">
          <el-button @click="save" type="primary">
            강의 지식맵 저장
          </el-button>
        </div>
      </el-row>
      <br />
      <el-row>
        <el-col :span="12">
          <knowledge-map-node-editor></knowledge-map-node-editor>
        </el-col>
        <el-col :span="12">
          <knowledge-map-edge-editor></knowledge-map-edge-editor>
        </el-col>
      </el-row>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex';
  import vis from 'vis';
  import KnowledgeMapNodeEditor from './NNKnowledgeMapNodeEditor';
  import KnowledgeMapEdgeEditor from './NNKnowledgeMapEdgeEditor';

  export default {
    components: {
      KnowledgeMapNodeEditor,
      KnowledgeMapEdgeEditor,
    },
    data() {
      const vm = this;
      return {
        network: null,
        container: '',
        options: {
          manipulation: {
            enabled: true,
            addNode: false,
            editEdge: false,
            deleteNode(data, callback) {
              callback(data);
              const index = vm.nodes.findIndex(item => item.id === data.nodes[0]);
              vm.nodes.splice(index, 1);
            },
            deleteEdge(data, callback) {
              callback(data);
              const index = vm.edges.findIndex(item => item.id === data.edges[0]);
              vm.deleteLectureKeywordRelation({ index, lectureId: vm.$route.params.lectureId });
              vm.edges.splice(index, 1);
            },
            addEdge(data, callback) {
              if (data.from !== data.to) {
                callback(data);
                // after each adding you will be back to addEdge mode
                vm.network.addEdgeMode();
                vm.edges.push({
                  from: data.from,
                  to: data.to,
                  id: data.from.concat(data.to),
                  weight: 20,
                });
              }
            },
            // initiallyActive: true,
          },
          layout: {
            randomSeed: 3,
            improvedLayout: true,
            hierarchical: {
              enabled: false,
              levelSeparation: 150,
              nodeSpacing: 100,
              treeSpacing: 200,
              blockShifting: true,
              edgeMinimization: true,
              parentCentralization: true,
              direction: 'LR',        // UD, DU, LR, RL
              sortMethod: 'hubsize',   // hubsize, directed
            },
          },
          autoResize: true,
          physics: {
            enabled: true,
            barnesHut: {
              gravitationalConstant: -1000,
              centralGravity: 0.1,
              springLength: 300,
              springConstant: 0.05,
              damping: 0.1,
            },
            repulsion: {
              centralGravity: 0.2,
              springLength: 200,
              springConstant: 0.05,
              nodeDistance: 200,
              damping: 0.09,
            },
            solver: 'repulsion',
            stabilization: {
              enabled: true,
              iterations: 1000,
              updateInterval: 100,
              onlyDynamicEdges: false,
              fit: true,
            },
          },
          // interaction: {
          //   hideEdgesOnDrag: true,
          //   hover: true,
          // },
          nodes: {
            borderWidth: 2,
            chosen: {
              node: (values) => {
                values.borderWidth *= 3;  // eslint-disable-line
                values.color = '#f1f1f1'; // eslint-disable-line
              },
            },
            shape: 'dot',
            font: {
              size: 25,
            },
            color: {
              background: '#97C2FC',
            },
          },
          edges: {
            arrows: {
              to: { enabled: true, scaleFactor: 1, type: 'arrow' },
            },
            selectionWidth(width) {
              return width * 3;
            },
            hoverWidth(width) {
              return width * 2;
            },
          },
        },
        animation: { // -------------------> can be a boolean too!
          duration: 1000,
          easingFunction: 'easeInOutQuad',
        },
      };
    },
    async mounted() {
      const vm = this;
      await vm.getKeywordsAndWeights(vm.$route.params);
      await vm.getLectureKeywordRelations(vm.$route.params);
      vm.container = document.getElementById('myNetwork');
      const data = {
        nodes: vm.nodes,
        edges: vm.edges,
      };
      vm.network = new vis.Network(vm.container, data, vm.options);
    },
    computed: {
      ...mapState('kMap', ['nodes', 'edges', 'drawFlag']),
      graph_data() {
        const vm = this;
        return {
          nodes: vm.nodes,
          edges: vm.edges,
        };
      },
      reDrawFlag() {
        const vm = this;
        return vm.drawFlag;
      },
    },
    watch: {
      reDrawFlag: {
        async handler(newVal) {
          const vm = this;
          if (newVal) {
            vm.container = document.getElementById('myNetwork');
            vm.network = await new vis.Network(vm.container, vm.graph_data, vm.options);
            vm.updateDrawFlag(!vm.reDrawFlag);
          }
        },
      },
    },
    methods: {
      ...mapActions('kMap', ['postLectureKeywords', 'postLectureKeywordRelations', 'getKeywordsAndWeights', 'getLectureKeywordRelations', 'deleteLectureKeywordRelation']),
      ...mapMutations('kMap', ['updateDrawFlag']),
      save() {
        const vm = this;
        vm.postLectureKeywords(vm.$route.params);
        vm.postLectureKeywordRelations(vm.$route.params);
      },
    },
  };
</script>

<style src="vis/dist/vis.min.css">
</style>

<style lang="scss" scoped>
    #myNetwork {
      height: 600px;
      border: 1px solid lightgray;
    }
</style>
