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
      }, 1500);
    });
  },
  fetchScenarioList({ teachingClassName }) {
    // teachingClass라는 과목에 대한 시나리오 정보
    // TODO: Replace dummy with axios
    window.console.log(teachingClassName);
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([
          {
            num: 1,
            type: 'A',
            lectureType: '온라인',
            teacher: '-',
            scenarioName: '1강 (OT)',
            date: '2018-01-02 09:00 ~ 2018-01-09 09:00',
            student: 131,
            understanding: 100,
          },
          {
            num: 2,
            type: 'A',
            lectureType: '실시간 온라인',
            teacher: '오현석(나)',
            scenarioName: '2강 (변수)',
            date: '2018-01-09 09:00 ~ 2018-01-09 09:00',
            student: 177,
            understanding: 86,
          },
          {
            num: 3,
            type: 'A',
            lectureType: '실시간 온라인',
            teacher: '오현석(나)',
            scenarioName: '3강 (조건문과 반복문)',
            date: '2018-01-13 15:00 ~ 2018-01-13 19:00',
            student: 165,
            understanding: 57,
          },
          {
            num: 4,
            type: 'B',
            lectureType: '온라인',
            teacher: '-',
            scenarioName: '1차숙제 (1~3강)',
            date: '2018-01-13 19:00 ~ 2018-01-17 23:59',
            student: 130,
            understanding: 72,
          },
          {
            num: 5,
            type: 'C',
            lectureType: '온라인',
            teacher: '-',
            scenarioName: '1차퀴즈 (1~3강)',
            date: '2018-01-15',
            student: 130,
            understanding: 72,
          },
        ]);
      }, 500);
    });
  },
};
