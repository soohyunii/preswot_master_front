<template>
  <div id="material_upload_wrapper">
    <!-- 강의 자료 및 영상 업로드 -->
    <el-row>
      <el-col :span="12">
        <h3>강의 자료 업로드</h3>
        <br />
        <el-upload
          action="#"
          multiple
          :http-request="doUpload"
          :on-remove="handleRemove"
          :file-list="fileList"
          ref="materialUpload"
        >
          <el-button slot="trigger" type="primary">강의 자료 추가</el-button>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <h3>강의 영상 등록</h3>
        <el-input v-model="modifiedLink" style="width: 400px" placeholder="유튜브 공유URL을 입력해주세요.">
          <el-button v-if="videolink === ''" slot="append" @click="onClick('LINKUPLOAD')">추가</el-button>
          <el-button v-if="videolink !== ''" slot="append" @click="onClick('LINKUPLOAD')">수정</el-button>
        </el-input>
        <br><br>
        <iframe v-if="videolink !== ''" width="420" height="315" :src="combinedUrl" frameborder="0"></iframe>
      </el-col>
    </el-row>
    <!-- 강의자료 & 키워드 목록 -->
    <div style="height: 100px;" />
    <h3>자료 키워드 연결</h3>
    <el-table
      ref="multipleTable"
      :data="fileNameKeywordList"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="파일명" width="450px">
        <template slot-scope="scope">{{ scope.row.data.file.name }}</template>
      </el-table-column>
      <el-table-column label="자료 키워드">
        <template slot-scope="scope">
          <!--<el-tag v-for="k in scope.row.keywordList" :key="k" closable @close="onClick('DELETE_KEYWORD', scope.row.data, k)">{{ k.keyword }} / {{ k.score }}</el-tag>-->
          <el-tag v-for="(k, index) in scope.row.keywordList" :key="index" closable @close="deleteMKeyword(scope.row.data, k)">{{ k.keyword }} / {{ k.score }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 50px;" />
    <!-- 선택된 강의자료들에 대해 키워드 등록 -->
    <el-form>
      <el-form-item label="강의 키워드" id="keyword">
        <el-autocomplete
          class="input-new-tag"
          v-model="input.keywordName"
          :fetch-suggestions="querySearch"
          ref="saveTagInput"
          placeholder="강의 키워드"
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
import { getIdFromURL } from 'vue-youtube-embed';
import lectureService from '../../services/lectureService';

export default {
  name: 'MaterialUpload',
  data() {
    return {
      videolink: '',
      modifiedLink: '',
      fileNameKeywordList: [],
      fileList: [],
      input: {},
      multipleSelection: [],
    };
  },
  // 페이지 로딩시 강의자료와 키워드들 불러오기
  async mounted() {
    const vm = this;
    let i1;
    const res = await lectureService.getLectureMaterial({
      lectureId: vm.$route.params.lectureId,
    });
    res.data.forEach((x) => {
      vm.fileList.push(x.file);
    });
    for (i1 = 0; i1 < res.data.length; i1 += 1) {
      const dictMaterial = {};
      dictMaterial.data = res.data[i1];
      const materialKeywords = await lectureService.getMaterialKeywords({ // eslint-disable-line
        id: res.data[i1].material_id,
      });
      dictMaterial.keywordList = materialKeywords.data;
      vm.fileNameKeywordList.push(dictMaterial);
    }

    const res2 = await lectureService.getLecture({
      lectureId: vm.$route.params.lectureId,
    });
    if (res2.data.video_link !== null) {
      vm.videolink = res2.data.video_link;
      vm.modifiedLink = res2.data.video_link;
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
    combinedUrl() {
      const vm = this;
      const id = getIdFromURL(vm.videolink);
      return `https://www.youtube.com/embed/${id}`;
    },
  },
  methods: {
    // 강의자료 업로드 (이 때 키워드는 당연히 비어있음)
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
      // 방금 넣은 강의자료 다시 받아오기
      const newMaterial = await lectureService.getLectureMaterial({
        lectureId: vm.$route.params.lectureId,
      });
      // 서버에 가장 나중에 넣은 강의자료 찾기
      let lastUploadNum = 0;
      let lastUploadTime = newMaterial.data[0].created_at;
      newMaterial.data.forEach((x, i) => {
        if (lastUploadTime < x.created_at) {
          lastUploadNum = i;
          lastUploadTime = x.created_at;
        }
      });

      // 최신 강의자료를 빈 키워드리스트와 묶어서 list에 넣기
      const dictMaterial = {};
      dictMaterial.keywordList = [];
      dictMaterial.data = newMaterial.data[lastUploadNum];
      vm.fileNameKeywordList.push(dictMaterial);
      vm.fileList.push(newMaterial.data[lastUploadNum].file);
    },
    async handleRemove(file) {
      // 삭제하는 파일의 id를 이용하여 서버에서 파일 삭제
      const indexFile = this.fileList.indexOf(file);
      const materialId = this.fileNameKeywordList[indexFile].data.material_id;
      await lectureService.deleteMaterial({
        id: materialId,
      });
      if (this.fileList.includes(file)) {
        // const indexFile = this.fileList.indexOf(file);
        this.fileList.splice(indexFile, 1);
        this.fileNameKeywordList.splice(indexFile, 1);
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
      let checkDup;
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
          vm.keywordList.forEach((x) => {
            if (x.keyword === vm.input.keywordName) {
              isEnroll = true;
            }
          });
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
          dictKeyword.score = vm.input.keywordValue;
          // 중복된 키워드인지 검사
          checkDup = false;
          vm.multipleSelection.forEach((x) => {
            const fileNum = vm.fileList.indexOf(x.data.file);
            vm.fileNameKeywordList[fileNum].keywordList.forEach((y) => {
              if (y.keyword === dictKeyword.keyword) {
                checkDup = true;
              }
            });
          });
          if (checkDup === true) {
            vm.$notify({
              title: '알림',
              message: '중복된 키워드입니다.',
              type: 'warning',
            });
            break;
          }
          vm.multipleSelection.forEach((x) => {
            // 프론트 상에 추가
            const fileNum = vm.fileList.indexOf(x.data.file);
            vm.fileNameKeywordList[fileNum].keywordList.push(dictKeyword);
            // 서버 상에 추가
            const materialId = this.fileNameKeywordList[fileNum].data.material_id;
            lectureService.postMaterialKeyword({
              id: materialId,
              keyword: dictKeyword.keyword,
              score: dictKeyword.score,
            });
          });
          break;
        }
        // 키워드 삭제
        case 'DELETE_KEYWORD': {
          let keyNum;
          const fileNum = vm.fileList.indexOf(arg.file);
          const materialId = vm.fileNameKeywordList[fileNum].data.material_id;
          vm.fileNameKeywordList[fileNum].keywordList.forEach((x, i) => {
            if (x === arg2) {
              keyNum = i;
            }
          });
          // 프론트에서 삭제
          const keywordName = vm.fileNameKeywordList[fileNum].keywordList[keyNum].keyword;
          // const scores = vm.fileNameKeywordList[fileNum].keywordList[keyNum].score;
          vm.fileNameKeywordList[fileNum].keywordList.splice(keyNum, 1);
          // 서버에서 삭제
          lectureService.deleteMaterialKeyword({
            id: materialId,
            key: keywordName,
          });
          break;
        }
        case 'LINKUPLOAD': {
          vm.videolink = vm.modifiedLink;
          lectureService.putLecture({
            lectureId: vm.$route.params.lectureId,
            videoLink: vm.videolink,
          });
          break;
        }
        default : {
          break;
        }
      }
    },
    async deleteMKeyword(arg, arg2) {
      const vm = this;
      let keyNum;
      const fileNum = vm.fileList.indexOf(arg.file);
      const materialId = vm.fileNameKeywordList[fileNum].data.material_id;
      vm.fileNameKeywordList[fileNum].keywordList.forEach((x, i) => {
        if (x === arg2) {
          keyNum = i;
        }
      });
      // 프론트에서 삭제
      const keywordName = vm.fileNameKeywordList[fileNum].keywordList[keyNum].keyword;
      // const scores = vm.fileNameKeywordList[fileNum].keywordList[keyNum].score;
      vm.fileNameKeywordList[fileNum].keywordList.splice(keyNum, 1);
      // 서버에서 삭제
      lectureService.deleteMaterialKeyword({
        id: materialId,
        keyword: keywordName,
      });
    },
  },
};
</script>