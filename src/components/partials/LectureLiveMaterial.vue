<template>
  <div>
    <div v-if="(materialList !== undefined) && (materialList.length > 0)">
      <el-checkbox
        v-model="checkAll"
        @change="handleCheckAllChange">
        강의자료
      </el-checkbox>
      <el-checkbox-group
        v-model="checkedMaterials"
        @change="handleCheckedMaterialChange">
        <el-checkbox
          style="display: block; margin-left: 30px"
          v-for="material in materialList"
          :key="material.file.file_guid"
          :label="material.file"
          >
          {{ material.file.name }}
          <i v-if="material.file.file_type === '.pptx'"
            class="el-icon-view" @click="onClick('VIEW', material.file)"></i>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <br>
    <el-button type="primary" @click="onClick('DOWNLOAD')">다운로드</el-button>
  </div>
</template>

<script>
// FIXME : 기존 다운로드 함수 이용시, 다운로드 폴더에 파일이 들어가는 대신 첫번째 파일 위치로 크롬창 주소가 변경되어 버리는 문제 발생
import utils from '../../utils';
import { baseUrl } from '../../services/config';

export default {
  props: ['materialList', 'presentMaterial'],
  data() {
    return {
      checkAll: false,
      checkedMaterials: [],
    };
  },
  methods: {
    handleCheckAllChange(val) {
      const vm = this;
      vm.checkedMaterials = val ? vm.materialList.map(element => element.file) : [];
    },
    handleCheckedMaterialChange(value) {
      const vm = this;
      const checkedCount = value.length;
      vm.checkAll = (checkedCount === vm.materialList.length);
    },
    onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'DOWNLOAD': {
          utils.downloadFiles(baseUrl, vm.checkedMaterials);
          break;
        }
        case 'VIEW': {
          const url = baseUrl + data.client_path;
          vm.presentMaterial(url);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>

<style>

</style>
