<template>
  <div>
    <h1>Hello, {{ name }} component.</h1>
  </div>
</template>

<script>
export default {
  name: `Test ${Math.random().toString(36).substring(7)}`,
  data() {
    return {
      name: `Test ${Math.random().toString(36).substring(7)}`,
    };
  },
};
</script>

