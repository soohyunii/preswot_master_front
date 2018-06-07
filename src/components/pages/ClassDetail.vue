<template>
  <div class="bt-container">
    <div class="wrapper"> <!-- position:absolute의 부모가 되기 위해 relative 속성 부여 -->
      <img :src="require('@/assets/orange.png')" height="400" width="100%">
      <div class="class-title-info">
        <div class="left">
          <div class="top">
            한국사
          </div>
          <div class="bottom">
            설민석 강사
          </div>
        </div>
        <div class="right">
          <el-button>수강하기</el-button>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="wrapper-box" id = "teacher-info">
        <div class="top semi-title-font">
          강사 소개
        </div>
        <div class="bottom">
          <div class="left">
            <img :src="require('@/assets/profi.png')" class="profile-pic">
          </div>
          <div class="right">
            가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@
            가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@
            가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@
            가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@
          </div>
        </div>
      </div>
      <div class="wrapper-box" id = "class-info">
        <div class="wrapper-box-row semi-title-font">과목 상세 소개
        </div>
        <div class="wrapper-box-row">
          <img :src="require('@/assets/test.jpg')" height="300" width="100%">
        </div>
        <div class="wrapper-box-row">
          가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@
          가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@
          가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@
          가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@  가즈아@@@@@@@@@@@@@@@@@
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import utils from '../../utils';

export default {
  name: 'ClassDetail',
  components: {
  },
  beforeMount() {
  },
  computed: {
    ...mapState('NNclass', ['popularClassList']),
  },
  data() {
    return {
      span: 0,
    };
  },
  methods: {
    ...mapActions('NNclass', [
      'getPopularClassList',
    ]),
  },
};
</script>
<style lang="scss" scoped>
.bt-container {
  position: relative;
}
.class-title-info {
  position:absolute;
  top: 200px;
  width: 97.5%;
  height: 200px;
}
.class-title-info .left {
  position: absolute;
  left: 5%;
  width: 50%;
  font-size: 21px;
}
.class-title-info .left .top {
  position: absolute;
  top: 0px;
}
.class-title-info .left .bottom {
  position: absolute;
  top: 100px;
}
.class-title-info .right {
  position: absolute;
  right: 5%;
  top: 90px;
}
.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.semi-title-font {
  font-size: 22px;
}
.wrapper-box {
  background-color: #ffffff;
  padding: 25px;
}
#teacher-info {
  margin-top: 30px;
}
#teacher-info .top {
  margin-bottom: 30px;
}
#teacher-info .bottom .left {
  width: 15%;
  float: left;
}
#class-info {
  margin-top: 60px;
}
#class-info .wrapper-box-row {
  margin-bottom: 30px;
}
</style>
