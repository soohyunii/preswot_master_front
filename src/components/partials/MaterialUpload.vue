<template>
  <div id="material_upload_wrapper">
    <!-- 강의 자료 업로드 -->
    <h3>강의 자료 업로드</h3>
    <br />
    <el-upload
      action="#"
      multiple
      :http-request="doUpload"
      :on-remove="handleRemove"
      :file-list="fileNameList"
      ref="materialUpload"
    >
      <el-button slot="trigger" type="primary">강의 자료 추가 [+]</el-button>
    </el-upload>
    <!-- 강의자료 & 키워드 목록 -->
    <div style="height: 100px;" />
    <h3>강의 자료-키워드 연결</h3>
    <el-table
      ref="multipleTable"
      :data="initFileList"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="파일명" width="450px">
        <template slot-scope="scope">{{ scope.row.file.name }}</template>
      </el-table-column>
      <el-table-column label="키워드">
        <template slot-scope="scope">
          <el-tag v-for="k in scope.row.keywordList" :key="k" closable @close="onClick('DELETE_KEYWORD', scope.row.file, k)">{{ k.keyword }} / {{ k. keyvalue }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 50px;" />
    <!-- 선택된 강의자료들에 대해 키워드 등록 -->
    <el-form>
      <el-form-item label="키워드" id="keyword">
        <el-autocomplete
          class="input-new-tag"
          v-model="input.keywordName"
          :fetch-suggestions="querySearch"
          ref="saveTagInput"
          placeholder="키워드"
        />
      <div style="display: inline-block; width: 100px;">
        <el-input id="input_keyword_point" v-model="input.keywordValue" placeholder="배점"></el-input>
      </div>
      <el-button @click="onClick('ADD_KEYWORD')">추가</el-button><br>
      <!--
      <div v-for="(item,index) in inputTail.assignedKeywordList" :key="item.keyword" style="display: inline-block; width: 200px;">
        <el-button>{{ item.keyword }} / {{ item.score }}</el-button>
        <el-button @click="onClick('DELETE_KEYWORD',index)" type="danger" style="margin: 0px">X</el-button>
      </div>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import lectureService from '../../services/lectureService';
import fileService from '../../services/fileService';

export default {
  name: 'MaterialUpload',
  data() {
    return {
      initFileList: [],
      fileNameList: [],
      input: {},
      multipleSelection: [],
    };
  },
  async mounted() {
    const vm = this;
    let i1;
    const res = await lectureService.getLectureMaterialAdditional({
      lectureId: vm.$route.params.lectureId,
    });
    vm.fileNameList = res.data.material; // TODO 불러올때 초기 파일 리스트 입력
    for (i1 = 0; i1 < vm.fileNameList.length; i1 += 1) {
      const dictMaterial = {};
      dictMaterial.file = vm.fileNameList[i1];
      dictMaterial.keywordList = [];
      vm.initFileList.push(dictMaterial);
    }
  },
  computed: {
    ...mapState('keyword', [
      'keywordList',
    ]),
    modifiedKeywordList() {
      const vm = this;
      return vm.keywordList.map(x => ({ value: x.keyword }));
    },
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
      // 키워드와 묶어서 list에 넣는 부분
      const dictMaterial = {};
      dictMaterial.file = req.file;
      dictMaterial.keywordList = [];
      vm.initFileList.push(dictMaterial);
      vm.fileNameList.push(req.file);
    },
    async handleRemove(file) {
      // 삭제하는 파일의 guid를 이용하여 서버에서 파일 삭제
      await fileService.deleteFile({
        fileGuid: file.file_guid,
      });
      if (this.fileNameList.includes(file)) {
        const indexFile = this.fileNameList.indexOf(file);
        this.fileNameList.splice(indexFile, 1);
        this.initFileList.splice(indexFile, 1);
      }
      // uploadFiles 배열에서 해당 항목 삭제 (자동적으로 이뤄짐)
    },
    querySearch(queryString, cb) {
      const vm = this;
      const results = queryString ?
        vm.modifiedKeywordList.filter(vm.createFilter(queryString)) : vm.modifiedKeywordList;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) { // eslint-disable-next-line
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onClick(type, arg, arg2) {
      const vm = this;
      let i1;
      switch (type) {
        case 'ADD_KEYWORD': {
          // 키워드를 등록할 강의자료를 선택하지 않은 경우
          if (vm.multipleSelection.length === 0) {
            vm.$notify({
              title: '알림',
              message: '키워드를 등록할 강의자료를 선택해 주세요.',
              type: 'warning',
            });
            break;
          }
          // 강의 키워드 목록에 없는 키워드인 경우
          let isEnroll = false;
          for (i1 = 0; i1 < vm.keywordList.length; i1 += 1) {
            if (vm.keywordList[i1].keyword === vm.input.keywordName) {
              isEnroll = true;
            }
          }
          if (isEnroll === false) {
            vm.$notify({
              title: '알림',
              message: '키워드 등록 탭에 등록되지 않은 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            break;
          }
          // 강의자료에 키워드 등록
          const dictKeyword = {};
          dictKeyword.keyword = vm.input.keywordName;
          dictKeyword.keyvalue = vm.input.keywordValue;
          for (i1 = 0; i1 < vm.multipleSelection.length; i1 += 1) {
            const fileNum = vm.fileNameList.indexOf(vm.multipleSelection[i1].file);
            vm.initFileList[fileNum].keywordList.push(dictKeyword);
          }
          break;
        }
        // 키워드 삭제
        case 'DELETE_KEYWORD': {
          let keyNum;
          const fileNum = vm.fileNameList.indexOf(arg);
          for (i1 = 0; i1 < vm.initFileList[fileNum].keywordList.length; i1 += 1) {
            if (vm.initFileList[fileNum].keywordList[i1] === arg2) {
              keyNum = i1;
            }
          }
          vm.initFileList[fileNum].keywordList.splice(keyNum, 1);
          break;
        }
        default : {
          break;
        }
      }
    },
  },
};
</script>