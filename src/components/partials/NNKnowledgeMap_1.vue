<template>
  <div class="wrapper" ref="wrapper">
    
    <!-- 디버그 용도
    <p>{{ nodes }}</p>
    <p>{{ edges }}</p>
    -->

    <!-- TODO 키워드 추출 부분 수정 후 작성할 것
    <div v-if="false"> 
      <br /><br />
      키워드 추출 진행중 <i class="el-icon-loading"> </i><br />
      다른 작업은 삼가 주세요.
    </div>
    -->
    
    <div>
      <svg style="width: 0px; height: 0px; float: left;">
        <defs>
          <marker id="m-end" markerWidth="10" markerHeight="10" refX="11" refY="3" orient="auto" markerUnits="strokeWidth" >
            <path d="M0,0 L0,6 L9,3 z"></path>
          </marker>
        </defs>
      </svg>
      <div class="network">
        <div class="bg" @click="selectReset()" v-if="d3DrawFlag === true">
          <d3-network 
            :net-nodes="nodes"
            :net-links="validEdges"
            :selection="{nodes: selectedNode, links: {}}"
            :options="options"
            :link-cb="lcb"
            @node-click="nodeClick" />
        </div>
        <el-row>
          <el-col :span="8">
            <el-button @click="save" type="primary">
              강의 지식맵 저장
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
  import { mapState, mapActions } from 'vuex';
  import D3Network from 'vue-d3-network';
  import KnowledgeMapNodeEditor from './NNKnowledgeMapNodeEditor';
  import KnowledgeMapEdgeEditor from './NNKnowledgeMapEdgeEditor';

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
      ...mapState('kMap', ['nodes', 'edges', 'd3DrawFlag']),
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
        };
      },
    },
    methods: {
      ...mapActions('kMap', ['postLectureKeywords', 'postLectureKeywordRelations']),
      nodeClick(event, node) {
        const vm = this;
        vm.resetFlag = false;
        if (vm.selectedNode) {
          vm.selectReset(true);
        }
        vm.selectedNode[node.id] = node;
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
      save() {
        const vm = this;
        vm.postLectureKeywords(vm.$route.params);
        vm.postLectureKeywordRelations(vm.$route.params);
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
