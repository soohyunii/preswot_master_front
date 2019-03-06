<template>
  <div class="quiz-item" style="background: #e5e9f2">

  </div>
</template>

<script>
import { mapState  } from 'vuex';
export default {
  computed: {
    ...mapState('studentQuestion', ['modifyQuestion']),
  },
  onCreate() {
    alert(`preview`);
  },
  props: ['data', 'answer'],
};
</script>