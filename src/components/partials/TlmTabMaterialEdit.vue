<template>
  <div id="tlm_tab_material_edit_wrapper">
    <el-row>
      <el-col>
        <material-upload />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MaterialUpload from '../partials/MaterialUpload';
import RecommendKeywords from '../partials/RecommendKeywords';

export default {
  name: 'TlmTabMaterialEdit',
  components: {
    MaterialUpload,
    RecommendKeywords,
  },
};
</script>
