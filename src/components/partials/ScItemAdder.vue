<template>
  <div class="wrapper">
    <el-row>
      <!-- TODO: change icon -->
      <el-col align="center" :span="6">
        <el-button @click="onClick('문항')" style="width: 100%;">
          <i class="fas fa-list-ol"></i><br />{{$t('ITEM.QUESTION')}}
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <el-button @click="onClick('설문')" style="width: 100%;">
          <i class="far fa-clipboard"></i><br />{{$t('ITEM.SURVEY')}}
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <el-button @click="onClick('숙제')" style="width: 100%;">
          <i class="fas fa-tasks"></i><br />{{$t('ITEM.HOMEWORK')}}
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <el-button @click="onClick('강의자료')" style="width: 100%;">
          <i class="far fa-file-pdf"></i><br />{{$t('ITEM.MATERIAL')}}
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <el-button @click="onClick('실습')" style="width: 100%;">
          <i class="far fa-file-code"></i><br />실습
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <el-button @click="onClick('토론')" style="width: 100%;">
          <i class="far fa-comments"></i><br />토론
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
import { mapActions, mapMutations, mapState } from 'vuex';
import isNil from 'lodash.isnil';

export default {
  name: 'ScItemAdder',
  computed: {
    ...mapState('sc', [
      'scOrderFilter',
    ]),
  },
  methods: {
    ...mapMutations('scItem', ['pushScItem']),
    ...mapActions('scItem', [
      'getScItem',
      'postScItem',
    ]),
    async onClick(type) {
      const vm = this;
      try {
        const validTypeList = ['문항', '설문', '숙제', '강의자료', '실습', '토론'];
        if (validTypeList.includes(type)) {
          const newOrder = isNil(vm.scOrderFilter) ? 0 : vm.scOrderFilter;
          const scItemId = await vm.postScItem({
            scItemType: type,
            scItemOrder: newOrder,
          });

          // * push scItem into sc
          vm.pushScItem({
            type,
            id: scItemId,
            order: newOrder,
          });

          // * Then this will update currentEditingScItem
          await vm.getScItem({
            scItemId,
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
