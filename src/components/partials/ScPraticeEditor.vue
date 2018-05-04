<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form ref="elForm" label-width="120px">
          <el-form-item label="코드">
            <el-input
              type="textarea"
              :rows="3"
              placeholder=""
              v-model.lazy="pCode"
              @change="onChange('CODE')"
            />
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.CODE" />
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
  import { mapMutations, mapGetters, mapActions } from 'vuex';

  export default {
    name: 'ScPracticeEditor',
    components: {
    },
    data() {
      return {
        loading: {
          CODE: false,
        },
      };
    },
    computed: {
      ...mapGetters('scItem', ['currentEditingScItem']),
      pCode: {
        get() {
          const vm = this;
          const p = vm.currentEditingScItem.practice;
          return p ? p.code : '';
        },
        set(pCode) {
          const vm = this;
          vm.assignCurrentEditingScItem({
            currentEditingScItem: {
              practice: {
                ...vm.currentEditingScItem.practice,
                code: pCode,
              },
            },
          });
        },
      },
    },
    methods: {
      ...mapMutations('scItem', ['assignCurrentEditingScItem']),
      ...mapActions('scItem', ['putPractice']),
      async onChange(type) {
        const vm = this;
        try {
          vm.loading[type] = true;
          await vm.putPractice();
        } catch (error) {
          vm.$notify({
            title: '저장 실패',
            message: error.toString(),
            type: 'error',
            duration: 0,
          });
        } finally {
          vm.loading[type] = false;
        }
      },
    },
  };
</script>
