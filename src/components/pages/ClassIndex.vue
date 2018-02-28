<template>
  <div>
    <el-row>
      <el-col
        v-for="item in openedClassList"
        :key="item.class_id"
        :span="8"
        style="padding: 5px;"
      >
        <class-intro-card
          :title="item.name"
          :description="item.description"
          :classId="item.class_id"
          :onClick="onClick"
          :label-span="5"
          :teacher-list="[item.master.email_id]"
          :start-date-str="formatDate(item.start_item)"
          :end-date-str="formatDate(item.end_time)"
        />
      </el-col>
    </el-row>
    {{ openedClassList }}
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ClassIntroCard from '../partials/ClassIntroCard';
import utils from '../../utils';

export default {
  name: 'ClassIndex',
  components: {
    ClassIntroCard,
  },
  mounted() {
    const vm = this;
    vm.getClassLists();
  },
  computed: {
    ...mapState('class', ['openedClassList']),
  },
  methods: {
    ...mapActions('class', [
      'getClassLists',
      'getMyClassLists',
      'postClassUser',
    ]),
    formatDate: utils.formatDate,
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'APPLY': {
          try {
            await vm.postClassUser({
              classId: data,
            });
            vm.$notify({
              title: '수강 신청 요청 성공',
              message: '메세지',
              type: 'success',
            });
          } catch (error) {
            vm.$notify({
              title: '수강 신청 요청 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }

          try {
            await vm.getMyClassLists();
            await vm.getClassLists();
          } catch (error) {
            vm.$notify({
              title: '과목 목록 가져오기 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
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
