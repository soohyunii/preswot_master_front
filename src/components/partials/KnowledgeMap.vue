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
      <d3-network
        :net-nodes="network.nodes"
        :net-links="network.edges"
        :options="options"
        :link-cb="lcb"
        @node-click="nodeClick"/>
      <el-row :gutter="10">
        <el-col :offset="20" :span="4">
          <el-radio-group v-model="mode">
            <!-- TODO: translate -->
            <!-- 수정 기능 ? -->
            <el-radio-button label="select">선택</el-radio-button>
            <el-radio-button label="pin">고정</el-radio-button>
            <el-radio-button label="delete">삭제</el-radio-button>
            <el-radio-button label="link">링크</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <knowledge-map-node-editor />
    </div>
    <h1>debug</h1>
    {{mode}}<br/>
    <pre>
      select node: {{selectedNode}}
      nodes: {{network.nodes}}
      edges: {{network.edges}}
    </pre>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import D3Network from 'vue-d3-network';
import KnowledgeMapNodeEditor from './KnowledgeMapNodeEditor';

export default {
  components: {
    D3Network,
    KnowledgeMapNodeEditor,
  },
  data() {
    return {
      mode: 'select',
      selectedNode: '',
      nodeSize: 10,
      canvas: false,
      linkWidth: 2.5,
      fontSize: 20,
    };
  },
  computed: {
    ...mapState('teacher', ['nodes', 'edges']),
    network() {
      const vm = this;
      return {
        nodes: vm.nodes.map(node => ({
          id: node.name,
          name: node.name,
          _size: node.weight,
        })),
        edges: vm.edges.map(edge => ({
          sid: edge.sid,
          tid: edge.tid,
        })),
      };
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
    nodeClick(event, node) {
      const vm = this;
      vm.selectedNode = node;
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
