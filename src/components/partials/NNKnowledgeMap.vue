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
          <knowledge-map-node-editor
            :updateNodeData="updateNodeData"/>
        </el-col>
        <el-col :span="12">
          <knowledge-map-edge-editor/>
        </el-col>
      </el-row>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex';
  import vis from 'vis';
  import KnowledgeMapNodeEditor from './NNKnowledgeMapNodeEditor';
  import KnowledgeMapEdgeEditor from './NNKnowledgeMapEdgeEditor';
  import { EventBus } from '../../event-bus';

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
        nodeData: new vis.DataSet(),
        edgeData: new vis.DataSet(),
        options: {
          locales: {
            en: {
              edit: 'edit',
              del: '선택 항목 삭제하기',
              back: '뒤로가기',
              addEdge: '키워드 연결하기',
              edgeDescription: '키워드를 클릭한 후, 드래그 앤 드롭으로 키워드를 서로 연결하세요.',
            },
          },
          edges: {
            arrows: {
              to: { enabled: true, scaleFactor: 1, type: 'arrow' },
            },
          },
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
          },
          interaction: {
            hover: true,
          },
          manipulation: {
            enabled: true,
            initiallyActive: true,
            addNode: false,
            editEdge: false,
            deleteNode(data, callback) {
              callback(data);
              // * find the deleted node index
              const index = vm.nodes.findIndex(item => item.id === data.nodes[0]);
              // * delete edges which were connected to the deleted node
              const edges = vm.edges.filter(edge =>
                edge.from !== vm.nodes[index].id && edge.to !== vm.nodes[index].id);
              vm.updateEdges({ edges });
              vm.deleteLectureKeyword({
                index,
                lectureId: vm.$route.params.lectureId,
              });
              vm.nodes.splice(index, 1);
            },
            deleteEdge(data, callback) {
              callback(data);
              const index = vm.edges.findIndex(item => item.id === data.edges[0]);
              vm.deleteLectureKeywordRelation({
                index,
                lectureId: vm.$route.params.lectureId,
              });
              vm.edges.splice(index, 1);
            },
            addEdge(data, callback) {
              // * from, to가 서로 같은 경우, 이미 존재하는 에지를 추가하는 경우는 vm.edges에 대한 정보를 업데이트 하지 않음
              if (data.from !== data.to &&
                  vm.edges.findIndex(item => item.from === data.from && item.to === data.to) === -1) {
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
          },
        },
      };
    },
    mounted() {
      const vm = this;
      EventBus.$on('drawNetwork', vm.drawNetwork);
      vm.drawNetwork();
    },
    computed: {
      ...mapState('kMap', ['nodes', 'edges']),
    },
    methods: {
      ...mapActions('kMap', [
        'postLectureKeywords',
        'postLectureKeywordRelations',
        'getKeywordsAndWeights',
        'getLectureKeywordRelations',
        'deleteLectureKeywordRelation',
        'deleteLectureKeyword',
      ]),
      ...mapMutations('kMap', ['updateEdges']),
      async drawNetwork() {
        const vm = this;
        // * get knowledgemap data
        await vm.getKeywordsAndWeights(vm.$route.params);
        await vm.getLectureKeywordRelations(vm.$route.params);

        vm.container = document.getElementById('myNetwork');
        // * initialize and add network DataSet
        vm.nodeData.clear();
        vm.edgeData.clear();
        vm.nodeData.add(vm.nodes);
        vm.edgeData.add(vm.edges);
        const data = {
          nodes: vm.nodeData,
          edges: vm.edgeData,
        };
        // * draw network graph
        vm.network = new vis.Network(vm.container, data, vm.options);
      },
      save() {
        const vm = this;
        vm.postLectureKeywords(vm.$route.params);
        vm.postLectureKeywordRelations(vm.$route.params);
      },
      updateNodeData(index) {
        const vm = this;
        vm.nodeData.update({
          id: vm.nodes[index].id,
          weight: vm.nodes[index].weight,
          color: vm.updateNodeColor(vm.nodes[index].weight),
        });
      },
      // * 그래프에서 엣지 스타일에 대한 dynamic change가 필요할 시 사용
      // updateEdgeData(index) {
      //   const vm = this;
      //   vm.edgeData.update({
      //     id: vm.edges[index].id,
      //     weight: vm.edges[index].weight,
      //   });
      // },
      updateNodeColor(weight) {
        let color = '#E4F1F6';
        if (weight > 75) {
          color = '#1A3E4C';
        } else if (weight > 50) {
          color = '#347B98';
        } else if (weight > 25) {
          color = '#67AFCB';
        }
        return color;
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
