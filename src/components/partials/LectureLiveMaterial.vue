<template>
  <div>
    <div v-if="(materialList !== undefined) && (materialList.length > 0)">
      <el-checkbox v-model="checkAllMaterials" @change="handleAllMaterialsChange">강의자료</el-checkbox>
      <el-checkbox-group v-model="checkedMaterials">
        <el-checkbox
          style="display: block; margin-left: 30px"
          v-for="material in materialList"
          :key="material.client_path"
          :label="material.client_path"
          @change="handleSingleMaterialChange">
          {{ material.name }}
        </el-checkbox>
      </el-checkbox-group>  
    </div>
    <el-button type="primary" @click="onClick('DOWNLOAD')">다운로드</el-button>
  </div>
</template>

<script>
// FIXME : 기존 다운로드 함수 이용시, 다운로드 폴더에 파일이 들어가는 대신 첫번째 파일 위치로 크롬창 주소가 변경되어 버리는 문제 발생
import utils from '../../utils';
import { baseUrl } from '../../services/config';

export default {
  props: ['materialList', 'additionalList'],
  data() {
    return {
      checkAllMaterials: false,
      checkedMaterials: [],
    };
  },
  methods: {
    handleAllMaterialsChange(val) {
      const vm = this;
      vm.checkedMaterials = val ? vm.materialList.map(element => element.client_path) : [];
    },
    handleSingleMaterialChange() {
      const vm = this;
      const checkedCount = vm.checkedMaterials.length;
      vm.checkAllMaterials = checkedCount === vm.materialList.length;
    },
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'DOWNLOAD': {
          vm.checkedMaterials.forEach((element) => {
            utils.downloadFile(baseUrl + element, 'TODOgetFilename.txt');
          });
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
