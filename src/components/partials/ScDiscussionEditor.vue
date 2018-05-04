<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">

        <discussion />

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
    name: 'ScPracticeEditor',
    components: {
      discussion,
    },
    data() {
      return {
        loading: {
          CODE: false,
        },
      };
    },
  };
</script>
