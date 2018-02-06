<template>
  <div class="wrapper" ref="wrapper">
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
        <el-col :span="4">
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
      size: {
        w: 600,
        h: 600,
      },
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
        size: vm.size,
      };
    },
  },
  methods: {
    ...mapMutations('teacher', ['setNodesPinned']),
    ...mapActions('teacher', ['postKnowledgeMapData']),
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
  },
  updated() {
    const vm = this;
    vm.$nextTick(() => {
      vm.size.w = vm.$refs.wrapper.clientWidth;
    });
  },
};
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style lang="scss" scoped>
// @import "~vue-d3-network/dist/vue-d3-network.css";

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
