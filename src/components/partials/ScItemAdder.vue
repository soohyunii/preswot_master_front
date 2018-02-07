<template>
  <div class="wrapper">
    <el-row>
      <!-- TODO: change icon -->
      <el-col align="center" :span="6">
        <el-button @click="onClick('문항')" style="width: 100%;">
          <i class="el-icon-question"></i><br />{{$t('ITEM.QUESTION')}}
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <el-button @click="onClick('설문')" style="width: 100%;">
          <i class="el-icon-edit-outline"></i><br />{{$t('ITEM.SURVEY')}}
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <el-button @click="onClick('숙제')" style="width: 100%;">
          <i class="el-icon-document"></i><br />{{$t('ITEM.HOMEWORK')}}
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <el-button @click="onClick('강의자료')" style="width: 100%;">
          <i class="el-icon-info"></i><br />{{$t('ITEM.MATERIAL')}}
        </el-button>
      </el-col>
    </el-row>
    <br/>
    <el-row class="label">
      <el-col :span="7">
        <hr/>
      </el-col>
      <el-col :span="10" align="center">
        {{$t('ADDER.ITEM_ADDER')}}
      </el-col>
      <el-col :span="7">
        <hr/>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
@import "~@/variables.scss";

.wrapper {
  border: 4px $app-gray dotted;
  background-color: white;
  padding: 5px 10px;

  .el-button {
    border-width: 0;
    padding: 6px 20px;
    i {
      font-size: 200%;
      margin: 5px 10px 10px 10px;
    }
  }

  .label {
    font-size: 85%;
    margin-top: 2px;
    margin-bottom: 10px;
  }
}
</style>


<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'ScItemAdder',
  methods: {
    ...mapMutations('teacher', ['pushScItem']),
    ...mapActions('teacher', ['postScItem']),
    async onClick(type) {
      const vm = this;
      try {
        const validTypeList = ['문항', '설문', '숙제', '강의자료'];
        if (validTypeList.includes(type)) {
          const scItemId = await vm.postScItem({
            scItemType: type,
          });

          vm.pushScItem({
            type,
            id: scItemId,
          });
        } else {
          throw new Error(`not defined type ${type}`);
        }
      } catch (error) {
        vm.$notify({
          title: '생성 실패',
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      }
    },
  },
};
</script>
