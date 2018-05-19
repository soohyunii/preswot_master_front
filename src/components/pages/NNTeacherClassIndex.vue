<template>
  <div id="teacher_class_index_wrwapper" class="bt-container">
    TODO: 과목 목록을 보여준다 쮸쀼쮸쀼 <br />
    <class-list type="TEACHER" />
    번호 / 과목 / 과목소개 / 기간 / - / - <br />
    1 / 한국사 / 누가 국사 소리를 내었는가 / 어제부터 내일까지 / 수정 버튼 / 삭제 버튼 <br />
    <br />
    TODO: 과목 개설 버튼을 넣는다<br />
  </div>
</template>

<script>
import ClassList from '../partials/ClassList';

export default {
  name: 'TeacherClassIndex',
  components: {
    ClassList,
  },
};
</script>
