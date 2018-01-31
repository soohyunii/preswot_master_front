<template>
  <div>
    <d3-network :net-nodes="nodes" :net-links="edges" :options="options"/>
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
// import { mapState } from 'vuex';
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
      nodes: [
        { id: 1, name: 'my node 1' },
        { id: 2, name: 'my node 2' },
        { id: 3, _color: 'orange' },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
      ],
      edges: [
        { sid: 1, tid: 2, _color: 'red' },
        { sid: 2, tid: 8, _color: 'f0f' },
        { sid: 3, tid: 4, _color: 'rebeccapurple' },
        { sid: 4, tid: 5 },
        { sid: 5, tid: 6 },
        { sid: 7, tid: 8 },
        { sid: 5, tid: 8 },
        { sid: 3, tid: 8 },
        { sid: 7, tid: 9 },
      ],
      options:
      {
        force: 3000,
        nodeSize: 20,
        nodeLabels: true,
        linkWidth: 5,
      },
    };
  },
};
</script>

