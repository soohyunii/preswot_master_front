export default {
  attendingClass() {
    // 수강중인 과목 정보
    console.log('Fetch classes info which user is attending'); // eslint-disable-line

    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          class1: {
            className: 'Python',
          },
          class2: {
            className: 'JavaScript',
          },
        });
      }, 500);
    });
  },
  openingClass() {
    // 강의중인 과목 정보
    console.log('Fetch classes info which user is opening'); // eslint-disable-line

    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          class1: {
            className: 'Vue.js',
          },
          class2: {
            className: 'Node.js',
          },
          class3: {
            className: 'TensorFlow with python and C++',
          },
          class4: {
            className: 'length_test_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          },
        });
      }, 500);
    });
  },
};
