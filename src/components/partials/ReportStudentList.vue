<template>
  <div class="ts">
    <!-- TODO: translation -->
    <el-row>
      <el-col :offset="21" :span="3" style="text-align:right;">
        <i class="el-icon-close" @click="onClick('CLOSE_STATUSBAR')" />
      </el-col>
    </el-row>
    <el-row>
      <h1>수강생 목록</h1>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3" v-for="(item, index) in forLoopData" :key="index">
        <div class="one_user" v-on:click="select($event, item.user_id)">
          <div class="user_info">
            <!-- TODO : 사진 넣기 -->
            <div class="user_name">이름 : {{item.name}}</div>
            <div class="user_id">아이디 : {{item.email_id}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .ts.activeInfo{
    max-height: 85%;
    visibility: visible;
  }
  .el-row {
    margin-bottom: 20px;
    padding-left:30px;
    padding-right:30px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .one_user {
    width:100px;
    height:200px;
    margin: 0 auto;
    padding:10px 10px 10px 10px;
    text-align:center;
  }
  .user_pic {
    width:100%;
    height:100px;
    background-size:cover;
    border-radius:50%
  }
  .user_info {
    padding-top:10px;
    font-size:12px;
  }
  .select_btn{
    width: 100px;
    height: 50px;
    background-color: #ff7c25;
    display: -webkit-box;
    -webkit-box-align: center;
    float: left;
    margin-right: 20px;
    -webkit-box-pack: center;
  }
  .ts{
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    padding: 8px 0px 5px 0px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    -webkit-transition: max-height 2s;
    transition: max-height 2s;
    overflow: hidden;
    height: 100%;
    max-height: 99%;
  }

</style>
<script>
import { mapState, mapActions } from 'vuex';


export default {
  // TODO: 전달되는 데이터 명 확인
  name: 'ReportStudentList',
  props: ['attendeeList'],
  data() {
    return {
      forLoopData: this.attendeeList,
    };
  },
  computed: {
    ...mapState('report', ['isAttendeeVisable', 'currentClassId']),
  },
  methods: {
    ...mapActions('report', ['toggleAttendeeVisable']),
    select(e, userId) {
      const vm = this;
      // console.log(userId);
      vm.$router.push(`/a/report/student/${userId}/class/${vm.currentClassId}/`);
    },
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'CLOSE_STATUSBAR': {
          vm.toggleAttendeeVisable();
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
