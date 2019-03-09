<template>
  <div class="quiz-item" style="background: #e5e9f2">
    <h1>quiz preview</h1>
  </div>
</template>

<script>
import { mapState  } from 'vuex';
export default {
  computed: {
    ...mapState('studentQuestion', ['modifyQuestion']),
  },
  created() {
    alert(`preview`);
  },
  props: ['data', 'answer'],
};
</script>