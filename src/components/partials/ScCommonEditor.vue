<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elFrom" label-width="120px">
          <el-form-item label="아이템 제목" prop="scItemTitle">
            <el-input placeholder="아이템 제목" v-model="scItemTitle"></el-input>
          </el-form-item>

          <el-form-item label="아이템 설명" prop="scItemDescription">
            <el-input
              type="textarea"
              :rows="3"
              v-model="scItemDescription"
              placeholder="dd"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'ScCommonEditor',
  computed: {
    ...mapState('teacher', ['currentEditingScItemIndex']), // TODO: delete
    ...mapGetters('teacher', ['currentEditingScItem']),
    input() {
      const res = {};
      const vm = this;
      res.scItemTitle = vm.scItemTitle;
      res.scItemDescription = vm.scItemDescription;
      return res;
    },
    scItemTitle: {
      get() {
        const vm = this;
        // const i = vm.currentEditingScItemIndex;
        const item = vm.currentEditingScItem;
        if (!item) {
          return '';
        }
        return item.title;
      },
      set(scItemTitle) {
        const vm = this;
        // TODO: refactor! (not to update ectureElementIndex)
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            title: scItemTitle,
          },
        });
      },
    },
    scItemDescription: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return '';
        }
        return item.description;
      },
      set(scItemDescription) {
        const vm = this;
        // TODO: refactor! (not to update lectureELementIndex)
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            description: scItemDescription,
          },
        });
      },
    },
  },
  methods: {
    ...mapMutations('teacher', ['assignCurrentEditingScItem']),
  },
};
</script>
