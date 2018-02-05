<template>
  <div class="wrapper">
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
          @node-click="nodeClick"/>
      </div>
      <el-row>
        <!-- TODO: translate -->
        <el-col>
          <el-radio-group v-model="mode">
            <el-radio-button label="select">선택</el-radio-button>
            <el-radio-button label="pinning">고정</el-radio-button>
            <!-- <el-radio-button label="delete">삭제</el-radio-button> -->
            <!-- <el-radio-button label="link">링크</el-radio-button> -->
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
      selectedNode: {},
      nodeSize: 20,
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
    ...mapMutations('teacher', ['pinning', 'deleteNodes', 'addEdges']),
    nodeClick(event, node) {
      const vm = this;

      switch (vm.mode) {
        default:
        case 'select': {
          vm.resetFlag = false;
          vm.pinning({ pinned: false, node });
          if (vm.selectedNode) {
            vm.selectReset(true);
          }
          vm.selectedNode[node.id] = node;
          break;
        }
        case 'pinning': {
          vm.pinning({ pinned: true, node });
          break;
        }
        /*
        case 'delete': {
          vm.deleteNodes({ nodeIndex: node.index });
          vm.inputFlag.splice(node.index, 1);
          break;
        }
        case 'link': {
          vm.resetFlag = false;
          if (Object.keys(vm.selectedNode).length === 1) {
            const inputSid = vm.selectedNode[Object.keys(vm.selectedNode)[0]].id;
            const inputTid = node.id;
            if (inputSid === inputTid) {
              vm.$notify({
                title: 'Same',
                message: '쏘오쓰 타겟 다르게!!...',
                type: 'warning',
              });
              break;
            }
            let breakFlag = false;
            vm.validEdges.forEach((edge) => {
              const isduplicatedEdge = edge.sid === inputSid && edge.tid === inputTid;
              const isduplicatedReverseEdge = edge.tid === inputSid && edge.sid === inputTid;
              if (isduplicatedEdge || isduplicatedReverseEdge) {
                // TODO: translate
                vm.$notify({
                  title: 'Duplicated',
                  message: '이미 Edge가 존재하네요...',
                  type: 'warning',
                });
                breakFlag = true;
              }
            });
            if (breakFlag) {
              break;
            }
            const edge = {
              sid: inputSid,
              tid: inputTid,
              weight: 50,
            };
            vm.addEdges({ edge });
            vm.addEdgesInputFlag({ flag: { sid: false, tid: false, weight: false } });
            vm.selectReset(true);
          } else {
            if (vm.selectedNode) {
              vm.selectReset(true);
            }
            vm.selectedNode[node.id] = node;
          }
          break;
        } */
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
