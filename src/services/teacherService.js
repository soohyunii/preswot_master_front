export default {
  fetchTeachingClassList() {
    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([
          {
            className: 'Vue.js',
          },
          {
            className: 'Node.js',
          },
          {
            className: 'TensorFlow with python and C++',
          },
          {
            className: 'length_test_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          },
        ]);
      }, 500);
    });
  },
};
