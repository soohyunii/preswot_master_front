<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elFrom" label-width="120px">
          <el-form-item label="아이템 제목" prop="scItemTitle">
            <el-input
              placeholder="아이템 제목"
              v-model,lazy="scItemTitle"
              @change="onChange('TITLE')"
            >
            </el-input>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.TITLE" />

          <el-form-item label="아이템 설명" prop="scItemDescription">
            <el-input
              type="textarea"
              :rows="3"
              v-model="scItemDescription"
              placeholder="dd"
            >
            </el-input>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.DESCRIPTION" />

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ScCommonEditor',
  data() {
    return {
      loading: {
        TITLE: false,
        DESCRIPTION: false,
      },
    };
  },
  computed: {
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
        const item = vm.currentEditingScItem;
        if (!item) {
          return '';
        }
        return item.title;
      },
      set(scItemTitle) {
        const vm = this;
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
    ...mapActions('teacher', [
      'putScItemTitle',
    ]),
    async onChange(type) {
      console.log('onChange2', type);
      const vm = this;
      try {
        vm.loading[type] = true;
        switch (type) {
          case 'TITLE': {
            await vm.putScItemTitle({
              scItemTitle: vm.scItemTitle,
            });
            break;
          }
          case 'DESCRIPTION': {
            break;
          }
          default: {
            throw new Error(`not defined scItemType ${type}`);
          }
        }
      } catch (error) {
        vm.$notify({
          title: '저장 실패',
          message: error.toString(),
          type: 'error',
        });
      } finally {
        vm.loading[type] = false;
      }
    },
  },
};
</script>
