<template>
  <div>
    <class-intro-card
      title="타이틀 어쩌고"
      description="설명 저쩌고"
      :label-span="5"
      :teacher-list="['a', 'b']"
      :start-date-str="'ddd'"
      :end-date-str="'fffff'"
    />
  </div>
</template>

<script>
import ClassIntroCard from '../partials/ClassIntroCard';

export default {
  name: 'ClassIndex',
  components: {
    ClassIntroCard,
  },
};
</script>
