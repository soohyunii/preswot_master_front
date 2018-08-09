<template>
  <div id="material_upload_wrapper">
    <el-upload
      action="#"
      multiple
      :http-request="doUpload"
      :on-remove="handleRemove"
      :file-list="initFileList"
      ref="materialUpload"
    >
      <el-button slot="trigger" type="primary">강의 자료 추가</el-button>
    </el-upload>
  </div>
</template>

<script>
import lectureService from '../../services/lectureService';
import fileService from '../../services/fileService';

export default {
  name: 'MaterialUpload',
  data() {
    return {
      initFileList: [],
    };
  },
  async mounted() {
    const vm = this;
    const res = await lectureService.getLectureMaterialAdditional({
      lectureId: vm.$route.params.lectureId,
    });
    vm.initFileList = res.data.material; // TODO 불러올때 초기 파일 리스트 입력
  },
  methods: {
    async doUpload(req) {
      const vm = this;
      // 서버에 저장할 것.

      const res = await lectureService.postLectureMaterial({
        lectureId: vm.$route.params.lectureId,
        file: req.file,
      });

      // guid 받아서 uploadFiles 배열속 객체의 guid 속성으로 넣을 것
      const res2 = vm.$refs.materialUpload.uploadFiles.find(
        element => element.uid === req.file.uid,
      );

      res2.file_guid = res.data.file.file_guid;
    },
    async handleRemove(file) {
      // 삭제하는 파일의 guid를 이용하여 서버에서 파일 삭제
      await fileService.deleteFile({
        fileGuid: file.file_guid,
      });
      // uploadFiles 배열에서 해당 항목 삭제 (자동적으로 이뤄짐)
    },
  },
};
</script>

