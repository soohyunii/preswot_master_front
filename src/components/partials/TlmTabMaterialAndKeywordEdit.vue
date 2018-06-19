<template>
  <div id="tlm_tab_material_and_keyword_edit_wrapper">
    <el-row>
      <!--
      <el-col :span="12">
        <h3>강의 자료 업로드</h3>
        <material-upload />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <h3>추천 키워드 <span style="font-weight: 400;">(오른쪽으로 드래그)</span></h3>
        <recommend-keywords />
      </el-col>
      -->
      <el-col :span="12">
        <h3>키워드 등록</h3>
        <lecture-keywords-editor />
      </el-col>
    </el-row>
    <div class="ps-align-right">
      <el-button @click="onClick('SUBMIT_KEYWORDS')" type="primary">키워드 수정 완료</el-button>
    </div>
  </div>
</template>


<script>
import MaterialUpload from '../partials/MaterialUpload';
import RecommendKeywords from '../partials/RecommendKeywords';
import LectureKeywordsEditor from '../partials/LectureKeywordsEditor';

export default {
  name: 'TlmTabMaterialAndKeywordEdit',
  components: {
    MaterialUpload,
    RecommendKeywords,
    LectureKeywordsEditor,
  },
  props: ['onClick'],
};
</script>
