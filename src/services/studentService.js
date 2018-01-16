export default {
  fetchAttendingClassList() {
    // 수강중인 과목 정보
    console.log('Fetch classes info which user is attending'); // eslint-disable-line

    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([
          {
            className: 'Python',
          },
          {
            className: 'JavaScript',
          },
        ]);
      }, 500);
    });
  },
  fetchPopularClassList() {
    // 인기강의 정보
    console.log('Fetch classes info. which are popular than others'); // eslint-disable-line

    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([
          {
            className: 'Deep learning',
          },
          {
            className: 'Tensorflow',
          },
          {
            className: 'C/C++',
          },
          {
            className: 'Vue.js',
          },
        ]);
      }, 500);
    });
  },
};
