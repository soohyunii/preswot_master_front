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
          :net-links="edges"
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
      </el-row>
    </div>
    <word-cloud-example :keywords="nodes"/>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import D3Network from 'vue-d3-network';
import WordCloudExample from '../partials/WordCloudExample';

export default {
  name: 'ClassKnowledgeMap',
  data() {
    return {
      mode: 'NOT_PINNED',
      selectedNode: {},
      nodeSize: 20,
      canvas: false,
      linkWidth: 2.5,
      fontSize: 20,
      resetFlag: true,
      debug: null,
    };
  },
  computed: {
    ...mapState('class', ['nodes', 'edges']),
    ...mapGetters('class', [
      'currentClass',
    ]),
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
  components: {
    D3Network,
    WordCloudExample,
  },
  methods: {
    ...mapMutations('class', ['setNodesPinned']),
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
