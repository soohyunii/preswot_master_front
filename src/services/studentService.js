export default {
  fetchAttendingClassList() {
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
      }, 3000);
    });
  },
  fetchPopularClassList() {
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
