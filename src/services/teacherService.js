export default {
  fetchTeachingClassList() {
    // 강의중인 과목 정보
    console.log('Fetch classes info which user is opening'); // eslint-disable-line

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
