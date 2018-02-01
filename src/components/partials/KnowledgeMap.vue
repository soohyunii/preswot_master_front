<template>
  <div class="wrapper">
    <svg style="width: 0px; height: 0px; float: left;">
      <defs>
        <marker id="m-end" markerWidth="10" markerHeight="10" refX="11" refY="3" orient="auto" markerUnits="strokeWidth" >
          <path d="M0,0 L0,6 L9,3 z"></path>
        </marker>
        <marker id="m-start" markerWidth="6" markerHeight="6" refX="-4" refY="3" orient="auto" markerUnits="strokeWidth" >
          <rect width="3" height="6"></rect>
        </marker>
      </defs>
    </svg>
    <div class="network">
      <div class="bg" @click="selectReset()">
        <d3-network
          :net-nodes="nodes"
          :net-links="validEdges"
          :options="options"
          :link-cb="lcb"
          @node-click="nodeClick"/>
      </div>
      <el-row :gutter="5">
        <el-col :span="1.5">
          <!-- TODO: translate -->
          <el-checkbox v-model="pinningMode" border>고정</el-checkbox>
        </el-col>
        <!-- TODO: translate -->
        <el-col :span="5">
          <el-radio-group v-model="mode">
            <el-radio-button label="select">선택</el-radio-button>
            <el-radio-button label="delete">삭제</el-radio-button>
            <el-radio-button label="link">링크</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <knowledge-map-node-editor></knowledge-map-node-editor>
        </el-col>
        <el-col :span="12">
          <knowledge-map-edge-editor></knowledge-map-edge-editor>
        </el-col>
      </el-row>
    </div>
    <h1>debug</h1>
    {{mode}}<br/>
  <pre>select node: {{selectedNode}}
  select node2: {{selectedNode2}}
  nodes: {{nodes}}
  edges: {{validEdges}}
  </pre>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
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
      mode: 'select',
      pinningMode: false,
      selectedNode: '',
      selectedNode2: '',
      nodeSize: 10,
      canvas: false,
      linkWidth: 2.5,
      fontSize: 20,
      resetFlag: true,
    };
  },
  computed: {
    ...mapState('teacher', ['nodes', 'edges']),
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
            // weigth: vm.edges[i].weigth,
          });
        }
      }
      // window.console.log(edges);
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
    ...mapMutations('teacher', ['pinning', 'deleteNodes', 'addEdges']),
    nodeClick(event, node) {
      const vm = this;
      vm.pinning({ pinned: vm.pinningMode, node });

      switch (vm.mode) {
        default:
        case 'select': {
          vm.resetFlag = false;
          vm.selectedNode = node;
          break;
        }
        case 'delete': {
          vm.deleteNodes({ nodeIndex: node.index });
          break;
        }
        case 'link': {
          vm.resetFlag = false;
          if (!vm.selectedNode) {
            vm.selectedNode = node;
          } else {
            vm.selectedNode2 = node;
          }

          if (vm.selectedNode && vm.selectedNode2) {
            // const edge =
            // vm.addEdges(edge);
            vm.selectedNode = '';
            vm.selectedNode2 = '';
          }
          break;
        }
      }
    },
    selectReset() {
      const vm = this;
      if (vm.resetFlag) {
        vm.selectedNode = '';
        vm.selectedNode2 = '';
      }
      vm.resetFlag = true;
    },
    lcb(link) {
      link._svgAttrs = { // eslint-disable-line
        'marker-end': 'url(#m-end)',
        'marker-start': 'url(#m-start)',
      };
      return link;
    },
  },
};
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style lang="scss" scoped>

.wrapper {

  .network {
    min-height: 600px;
    background-color: white;
  }

  #m-end path, #m-start{
    fill: rgba(18, 120, 98, 0.8);
  }

}
</style>
