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
    ...mapActions('class', ['getClassLists']),
    formatDate: utils.formatDate,
    onClick(type, data) {
      switch (type) {
        case 'APPLY': {
          console.log('data', data);
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
