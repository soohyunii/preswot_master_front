<template>
  <div>
    NN Teacher Class New Template <br />
    isEdit: {{ isEdit }} <br />
  </div>
</template>

<script>
export default {
  name: 'TeacherClassNew',
  data() {
    return {
      isEdit: false,
    };
  },
  beforeMount() {
    this.isEdit = this.$route.fullPath.includes('/edit');
  },
};
</script>

