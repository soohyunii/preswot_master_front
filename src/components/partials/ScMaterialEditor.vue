<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form ref="elForm" label-width="120px">
          <el-form-item label="키워드">
            <keyword-editor></keyword-editor>
          </el-form-item>
          <el-form-item label="배점">
            <el-input
              type='number'
              v-model.lazy="mScore"
              @change="onChange('SCORE')"
            />
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.SCORE" />
          <el-form-item label="파일 업로드">
            <upload from="ScMaterialEditor"/>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Upload from './Upload';
import keywordEditor from './keywordEditor';

export default {
  name: 'ScMaterialEditor',
  components: {
    Upload,
    keywordEditor,
  },
  data() {
    return {
      maxRate: 10,
      loading: {
        SCORE: false,
      },
    };
  },
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    mScore: {
      get() {
        const vm = this;
        const m = vm.currentEditingScItem.material;
        return m ? m.score : 0;
      },
      set(mScore) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            material: {
              ...vm.currentEditingScItem.material,
              score: mScore,
            },
          },
        });
      },
    },
  },
  methods: {
    ...mapMutations('scItem', ['assignCurrentEditingScItem']),
    ...mapActions('scItem', ['putMaterial']),
    async onChange(type) {
      const vm = this;
      // // eslint-disable-next-line
      // console.log('type', type, vm.currentEditingScItem.question.type);
      try {
        vm.loading[type] = true;
        await vm.putMaterial();
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
