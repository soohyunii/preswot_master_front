<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">

        <discussion />


        <el-form ref="elForm" label-width="120px">
          <el-form-item label="학생간 공개">
            <el-radio-group
              v-model="pShare"
              @change="onChange('SHARE')"
            >
              <el-radio-button :label="false">비공개</el-radio-button>
              <el-radio-button :label="true">공개</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.SHARE" />

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
  import { mapMutations, mapGetters, mapActions } from 'vuex';
  import discussion from './Discussion';

  export default {
    name: 'ScDiscussionEditor',
    components: {
      discussion,
    },
    data() {
      return {
        loading: {
          SHARE: false,
        },
      };
    },
    computed: {
      ...mapGetters('scItem', ['currentEditingScItem']),
      pShare: {
        get() {
          const vm = this;
          return vm.currentEditingScItem.discussionShare;
        },
        set(pShare) {
          const vm = this;
          vm.assignCurrentEditingScItem({
            currentEditingScItem: {
              discussionShare: pShare,
            },
          });
        },
      },
    },
    methods: {
      ...mapMutations('scItem', ['assignCurrentEditingScItem']),
      ...mapActions('scItem', ['putDiscussion']),
      async onChange(type) {
        const vm = this;
        try {
          vm.loading[type] = true;
          await vm.putDiscussion();
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
