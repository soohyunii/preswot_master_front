<template>
  <div class="wrapper">
    <svg style="width: 1px; height: 1px; float: right;">
      <defs>
        <marker id="m-end" markerWidth="10" markerHeight="10" refX="11" refY="3" orient="auto" markerUnits="strokeWidth" >
          <path d="M0,0 L0,6 L9,3 z"></path>
        </marker>
        <marker id="m-start" markerWidth="6" markerHeight="6" refX="-4" refY="3" orient="auto" markerUnits="strokeWidth" >
          <rect width="3" height="6"></rect>
        </marker>
      </defs>
    </svg>
    <d3-network
      class="network"
      :net-nodes="nodes"
      :net-links="edges"
      :options="options"
      :link-cb="lcb"/>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import D3Network from 'vue-d3-network';

export default {
  components: {
    D3Network,
  },
  data() {
    return {
      nodes: [
        { id: 1, name: 'my node 1' },
        { id: 2, name: 'my node 2' },
        { id: 3, _size: 20 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
      ],
      edges: [
        { sid: 1, tid: 2 },
        { sid: 2, tid: 8 },
        { sid: 3, tid: 4 },
        { sid: 4, tid: 5 },
        { sid: 5, tid: 6 },
        { sid: 7, tid: 8 },
        { sid: 5, tid: 8 },
        { sid: 3, tid: 8 },
        { sid: 7, tid: 9 },
      ],
      nodeSize: 15,
      canvas: false,
      linkWidth: 2,
    };
  },
  computed: {
    options() {
      const vm = this;
      return {
        force: 5000,
        nodeSize: vm.nodeSize,
        nodeLabels: true,
        canvas: vm.canvas,
        linkWidth: vm.linkWidth,
      };
    },
  },
  methods: {
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
  background-color: white;

  .network {
    min-height: 600px;
  }

  .node {
    background-color: white;
  }

  #m-end path, #m-start{
    fill: rgba(18, 120, 98, 0.8);
  }

}
</style>
