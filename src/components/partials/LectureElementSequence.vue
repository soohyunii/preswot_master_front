<template>
  <div>
    Lecture Element Sequence Template <br />
    seq variable: {{  lectureElementSequence}}
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LectureElementSequnce',
  computed: {
    ...mapState('teacher', ['lectureElementSequence']),
  },
};
</script>
