<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">조회하기 > 학과</h2>
    <div>
      <el-form width="100px">
        <el-select v-model="chosen" placeholder="대학선택" @change="onChange()" style="top:20px;">
          <el-option 
            v-for="name in uniName"
            :key="name.chosen"
            :label="name"
            :value="name">
          </el-option>
        </el-select>
      </el-form>  
      </div>
      <div style="margin-top: 50px;"/>
    <master-dept-table
      :list="list"
      :onClick="onClick"
    />
    <br/>
    <div class="right-align">
      <router-link to="/a/register/dept">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">학과 등록하기</div>
        </el-button>
      </router-link>
      <router-link to="/">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">홈으로</div>
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MasterDeptTable from '../partials/MasterDeptTable';
import utils from '../../utils';
import masterService from '../../services/masterService';

export default {
  name: 'ViewDept',
  components: {
    MasterDeptTable,
  },
  data() {
    return {
      userId: utils.getUserIdFromJwt(),
      searchType: 'name',
      searchText: '',
      list: [],
      uniName: '',
      chosen: '',
    };
  },
  async created() {
    const vm = this;

  },
  async mounted() {
    const vm=this;
    const uniNameLists = await masterService.getUniNameLists();
    vm.uniName = await uniNameLists.data.map(element => element.name);
  },
  methods: {
    async onClick(type, arg, arg2) {
      const vm = this;
      switch (type) {
        case 'DETAIL': {
          vm.$router.push(`/class/${arg.class_id}/classdetail`);
          break;
        }
        case 'LISTEN': {
          vm.$router.push(`/a/student/MasterDept/${arg.class_id}`);
          break;
        }
        case 'SEARCH': {
          vm.$router.push({ path: '/a/view/dept', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    onClickDelete(index) {
    },
    async onChange(payload) {
      const vm = this;
      const res = await masterService.getDeptLists({name : vm.chosen});
      vm.list = res.data;
    },
  },
};
</script>


<style lang="scss" scoped>
#class_index_wrapper {
  .page-title{
    float:left;
    width:1000px;
    height: 24px;

    font-family: SpoqaHanSans;
    font-size: 25px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000000;

    margin-top : 40px;
    margin-left : 12px;
    margin-bottom : 25px;
  }
  .el-form-item__label {
    font-size: 30px;
  }
  .elForm-label el-form-item{
    text-align : left;
    font-family: SpoqaHanSans;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: normal;
    color: #000000;
  }
  .el-form{
    font-family: SpoqaHanSans;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: normal;
    color: #000000;
    width: 200px;
    margin: 20px 0 0 10px;
  }
}
</style>
