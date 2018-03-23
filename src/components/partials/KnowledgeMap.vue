<template>
  <div class="wrapper" ref="wrapper">
    <div v-if="scKnowledgeMapState === 0">
      <br />
      강의 아이템 수정 탭에서 자료를 업로드 한후 아래의 [키워드 추출] 버튼을 눌러 키워드를 추출 하세요.
      <br /><br />
      키워드 추출을 원치 않는 경우 [진행] 버튼을 누르세요.
      <br /><br /><br />
      <el-form label-width="150px" style="max-width: 400px">
        <el-form-item label="자료당 추출 키워드 수">
          <el-input
            type='number'
            v-model.lazy="numberOfKeyword"
            min="3"
          />
        </el-form-item>
        <el-form-item label="키워드 최소 길이">
          <el-input
            type='number'
            v-model.lazy="keywordLength"
            min="1"
          />
        </el-form-item>
      </el-form>
      <el-button @click="buttonClick('EXTRACT')">키워드 추출</el-button>
      <el-button @click="buttonClick('GOING')">진행</el-button>
    </div>

    <div v-if="scKnowledgeMapState === 1">
      <br /><br />
      키워드 추출 진행중 <i class="el-icon-loading"> </i><br />
      다른 작업은 삼가 주세요.
    </div>

    <div v-if="scKnowledgeMapState === 2 || scKnowledgeMapState === 3">
      <svg style="width: 0px; height: 0px; float: left;">
        <defs>
          <marker id="m-end" markerWidth="10" markerHeight="10" refX="11" refY="3" orient="auto" markerUnits="strokeWidth" >
            <path d="M0,0 L0,6 L9,3 z"></path>
          </marker>
          <!--
          <marker id="m-start" markerWidth="6" markerHeight="6" refX="-4" refY="3" orient="auto" markerUnits="strokeWidth" >
            <rect width="3" height="6"></rect>
          </marker>-->
        </defs>
      </svg>
      <div class="network">
        <div class="bg" @click="selectReset()">
          <d3-network
            :net-nodes="nodes"
            :net-links="validEdges"
            :selection="{nodes: selectedNode, links: {}}"
            :options="options"
            :link-cb="lcb"
            @node-click="nodeClick" />
        </div>
        <el-row>
          <!-- TODO: translate -->
          <el-col :span="4">
            <el-switch
              v-model="mode"
              active-color="#13ce66"
              active-value="PINNED"
              active-text="선택 노드 고정"
              inactive-value="NOT_PINNED"
            >
            </el-switch>
          </el-col>
          <el-col :span="8">
            <el-button @click="save" type="primary">
              강의 지식맵 저장
            </el-button>
            <el-button @click="buttonClick('RE-EXTRACT')" type="primary">
              초기화 / 재추출
            </el-button>
          </el-col>
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
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import D3Network from 'vue-d3-network';
  import KnowledgeMapNodeEditor from './KnowledgeMapNodeEditor';
  import KnowledgeMapEdgeEditor from './KnowledgeMapEdgeEditor';

  export default {
    components: {
      D3Network,
      KnowledgeMapNodeEditor,
      KnowledgeMapEdgeEditor,
    },
    data() {
      return {
        mode: 'NOT_PINNED',
        selectedNode: {},
        nodeSize: 20,
        canvas: false,
        linkWidth: 2.5,
        fontSize: 20,
        resetFlag: true,
        numberOfKeyword: 10,
        keywordLength: 2,
      };
    },
    computed: {
      ...mapState('sc', ['nodes', 'edges', 'scKnowledgeMapState']),
      validEdges() {
        const vm = this;
        const edges = [];
        const nodesNames = [];
        for (let i = 0; i < vm.nodes.length; i += 1) {
          nodesNames.push(vm.nodes[i].name);
        }
        for (let i = 0; i < vm.edges.length; i += 1) {
          if (nodesNames.includes(vm.edges[i].sid) &&
            nodesNames.includes(vm.edges[i].tid)) {
            edges.push({
              sid: vm.edges[i].sid,
              tid: vm.edges[i].tid,
              // weight: vm.edges[i].weight,
            });
          }
        }
        return edges;
      },
      options() {
        const vm = this;
        return {
          force: 6000,
          nodeSize: vm.nodeSize,
          nodeLabels: true,
          canvas: vm.canvas,
          linkWidth: vm.linkWidth,
          fontSize: vm.fontSize,
          intervalJob: null,
        };
      },
    },
    mounted() {
      const vm = this;
      vm.intervalJob = setInterval(() => {
        if (vm.scKnowledgeMapState === 1) {
          vm.getSc();
        }
      }, 2000);
    },
    beforeDestroy() {
      const vm = this;
      clearInterval(vm.intervalJob);
    },
    methods: {
      ...mapMutations('sc', ['setNodesPinned', 'updateScKnowledgeMapState']),
      ...mapActions('sc', ['postKnowledgeMapData', 'putSc', 'executeExtractor', 'getSc']),
      nodeClick(event, node) {
        const vm = this;

        switch (vm.mode) {
          default:
          case 'NOT_PINNED': {
            vm.resetFlag = false;
            vm.setNodesPinned({ pinned: false, node });
            if (vm.selectedNode) {
              vm.selectReset(true);
            }
            vm.selectedNode[node.id] = node;
            break;
          }
          case 'PINNED': {
            vm.setNodesPinned({ pinned: true, node });
            break;
          }
        }
      },
      selectReset(immediately) {
        const vm = this;
        if (vm.resetFlag || immediately) {
          vm.selectedNode = {};
        }
        if (!immediately) {
          vm.resetFlag = true;
        }
      },
      lcb(link) {
        link._svgAttrs = { // eslint-disable-line
          'marker-end': 'url(#m-end)',
          'marker-start': 'url(#m-start)',
        };
        return link;
      },
      async save() {
        const vm = this;
        await vm.postKnowledgeMapData(); // TODO: try catch
      },
      buttonClick(type) {
        const vm = this;
        switch (type) {
          case 'EXTRACT': {
            vm.executeExtractor({
              numberOfKeyword: vm.numberOfKeyword,
              keywordLength: vm.keywordLength,
            });
            break;
          }
          case 'GOING': {
            vm.updateScKnowledgeMapState({ scKnowledgeMapState: 2 });
            vm.putSc();
            break;
          }
          case 'RE-EXTRACT': {
            vm.$confirm('모든 지식맵이 초기화 됩니다.', '다시 키워드를 추출 하시겠습니까?', {
              confirmButtonText: '예',
              cancelButtonText: '아니요',
              type: 'warning',
            }).then(() => {
              vm.updateScKnowledgeMapState({ scKnowledgeMapState: 0 });
            });
            break;
          }
          default: {
            throw new Error(`not defined type ${type}`);
          }
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrapper {

    .network {
      min-height: 600px;
      background-color: white;
    }

    #m-end path, #m-start{
      fill: rgba(18, 120, 98, 0.8);
    }

    .test {
      fill: rgb(255, 0, 0);
    }
  }
</style>

<style lang="scss">
  .net {
    height: 100%;
    margin: 0;
  }
  .node {
    stroke: rgba(18, 120, 98, .7);
    stroke-width: 3px;
    transition: fill .5s ease;
    fill: #dcfaf3
  }
  .node.import {
    stroke: rgba(255, 0, 0, .7);
  }
  .node.selected {
    stroke: #caa455;
  }
  .node.pinned {
    stroke: rgba(58, 56, 190, 0.6);
  }
  .link {
    stroke: rgba(18, 120, 98, .3);
  }
  .link, .node {
    stroke-linecap: round;
  }
  .link:hover, .node:hover {
    stroke: #be385d;
    stroke-width: 5px
  }
  .link.selected {
    stroke: rgba(202, 164, 85, .6);
  }
  .curve {
    fill: none;
  }
  .link-label, .node-label {
    fill: #127862;
  }
  .link-label {
    -webkit-transform: translateY(-.5em);
    -ms-transform: translateY(-.5em);
    transform: translateY(-.5em);
    text-anchor: middle;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
