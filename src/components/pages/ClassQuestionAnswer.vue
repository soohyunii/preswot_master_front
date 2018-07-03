<template>
  <div id="class_board_wrapper" class="bt-container">
    <h3>게시판</h3>
    <el-table :data="postList" @cell-click="onDetail" style="width: 100%">
      <el-table-column prop="board_id" label="번호" width="130">
      </el-table-column>
      <el-table-column prop="name" label="제목">
      </el-table-column>
      <el-table-column prop="user.name" label="작성자" width="180">
      </el-table-column>
      <el-table-column prop="created_at" label="등록일" width="230">
      </el-table-column>
      <el-table-column prop="num_views" label="조회수" width="180">
      </el-table-column>
    </el-table>
    <div class="liner">
      <div style="display: inline; position:relative; left:30%;">
        <el-button @click="onClick('NAVBACK')">&lt;&lt;</el-button>
        <el-button :key="navNum" v-for="navNum in navNumList" plain @click="onClick('CHANGEPAGE',navNum)">{{ navNum }}</el-button>
        <el-button @click="onClick('NAVNEXT')">&gt;&gt;</el-button>
      </div>
      <el-button style="float:right;" @click="onClick('WRITE')" plain>글쓰기</el-button>
    </div>
    <div style="display: inline; position:relative; left:34%;">
      <el-select v-model="searchType" style="display: inline-block; width: 100px">
        <el-option
          v-for="option in selectOptionList"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <div style="display: inline-block; width: 400px">
        <el-input placeholder="검색어를 입력하세요." v-model="searchWord" @keyup.enter="onClick('SEARCH')"></el-input>
      </div>
      <el-button @click="onClick('SEARCH')" icon="el-icon-search" circle></el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  async created() {
    const vm = this;
    vm.$data.postTotalCount = await vm.getPostTotalCount({
      classId: vm.$route.params.classId,
      type: this.$route.query.type,
      query: this.$route.query.query,
    });
    vm.updateNavNumList(1);
    await vm.getPostList({
      classId: vm.$route.params.classId,
      pageNum: vm.$route.params.pageNum,
      type: this.$route.query.type,
      query: this.$route.query.query,
    });
  },
  computed: {
    ...mapState('board', [
      'postList',
    ]),
    ...mapGetters('class', [
      'currentTeachingClass',
    ]),
  },
  methods: {
    ...mapActions('board', [
      'getPostList',
      'getPostTotalCount',
    ]),
    updateNavNumList(navStartNum) { // 게시판 하단 네비게이터를 업데이트 함
      const temp = this.$data.postTotalCount - (((navStartNum - 1) * 10) + 1);
      let naviAmount = (Math.floor(temp / 10) + 1);
      if (naviAmount > 10) {
        naviAmount = 10;
      }
      this.$data.navNumList = [];
      for (let i = 0; i < naviAmount; i += 1) {
        this.$data.navNumList.push(navStartNum + i);
      }
    },
    onDetail(row) {
      this.$router.push(`/a/class/${this.$route.params.classId}/questionanswerdetail/${row.board_id}`);
    },
    onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'SEARCH': {
          vm.$router.push({ path: `/a/class/${vm.$route.params.classId}/questionanswer/${vm.$route.params.pageNum}`, query: { type: `${vm.$data.searchType}`, query: `${vm.$data.searchWord}` } });
          break;
        }
        case 'WRITE': {
          vm.$router.push(`/a/class/${vm.$route.params.classId}/questionanswerwrite`);
          break;
        }
        case 'CHANGEPAGE': {
          vm.getPostList({
            classId: vm.$route.params.classId,
            pageNum: arg - 1,
          });
          break;
        }
        case 'NAVBACK': {
          if (vm.$data.navStartNum <= 1) {
            vm.$notify({
              title: '알림',
              message: '이전 목록이 없습니다.',
              type: 'error',
              duration: 0,
            });
          } else {
            vm.$data.navStartNum -= 10;
            vm.updateNavNumList(vm.$data.navStartNum);
          }
          break;
        }
        case 'NAVNEXT': {
          if (vm.$data.postTotalCount < ((vm.$data.navStartNum + 9) * 10) + 1) {
            vm.$notify({
              title: '알림',
              message: '다음 목록이 없습니다.',
              type: 'error',
              duration: 0,
            });
          } else {
            vm.$data.navStartNum += 10;
            vm.updateNavNumList(vm.$data.navStartNum);
          }
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
  data() {
    return {
      searchType: 'name',
      searchWord: '',
      postTotalCount: 0,
      navStartNum: 1,
      navNumList: [],
      selectOptionList: [{
        value: 'name',
        label: '제목',
      }, {
        value: 'user',
        label: '작성자',
      }],
    };
  },
};
</script>