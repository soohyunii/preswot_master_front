<template>
  <div id="material_upload_wrapper">
    TODO: material file upload api 요청 (필요 없을수도?)<br /><br />
    doUpload니 뭐니 하느니 el-upload의 action에 # 대신 바로 그냥 파일업로드 주소 때려박는게 best practice같음<br />
    <br />
    <el-upload
      action="#"
      multiple
    >
      <el-button slot="trigger" type="primary">파일추가 [+]</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'MaterialUpload',
  methods: {
    // doUpload(req) {
    //   // console.log('doUpload', req);
    // },
  },
};
</script>

