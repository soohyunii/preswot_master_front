<template>
  <div id="recommend_keywords_wrapper">
    recommend keywords template
    {{ recommendKeywordList }}
    <draggable element="div" v-model="recommendKeywordList" :options="dragOptions">
      <transition-group type="transition">
        <el-tag class="tag" type="warning" v-for="rk in recommendKeywordList" :key="rk">{{ rk }}</el-tag>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
// https://github.com/SortableJS/Vue.Draggable
// https://github.com/David-Desmaisons/draggable-example/blob/master/src/components/Hello.vue
import draggable from 'vuedraggable';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'RecommendKeywords',
  components: {
    draggable,
  },
  beforeMount() {
    const vm = this;
    vm.getKeywords(); // FIXME: 이거 밖에서 부르는게 더 나을듯
  },
  data() {
    return {
      dragOptions: {
        animation: 0,
        group: 'description',
        disable: false,
      },
    };
  },
  computed: {
    recommendKeywordList: {
      get() {
        const vm = this;
        const moved = new Set(vm.$store.state.lc.movedKeywordList);
        return vm.$store.state.lc.recommendKeywordList.filter(
          x => !moved.has(x),
        );
      },
      set(value) {
        console.log('set', value); // eslint-disable-line
        const vm = this;
        const recommend = vm.$store.state.lc.recommendKeywordList;
        const movedKeywordList = recommend.filter(x => !value.includes(x));
        console.log('movedKeywordList', movedKeywordList); // eslint-disable-line

        this.updateMovedKeywordList({
          movedKeywordList,
        });
      },
    },
  },
  methods: {
    ...mapMutations('lc', [
      'updateMovedKeywordList',
      'updateKeywordList',
    ]),
    ...mapActions('lc', [
      'getKeywords',
    ]),
    // onMove({ relatedContext, draggedContext }) {
    //   console.log('relatedContext,', relatedContext); // eslint-disable-line
    //   console.log('draggedContext', draggedContext); // eslint-disable-line
    // },
  },
};
</script>

<style lang="scss" scoped>
#recommend_keywords_wrapper {
  .tag {
    padding: 0 2em;
  }
}
</style>

