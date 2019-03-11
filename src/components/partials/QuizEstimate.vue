<template>
  <div class="form">
    <br>
    <div class="question">
      이름 : {{ question.name }}
    </div>
    <br>
    <div class="answer">
      <div v-if="question.type =='객관'">
        유형: 객관
        <br><br>
        문제: {{ question.question }}
        <br><br>
        <el-checkbox-group v-model="question.answer" size="small">

          <div v-for="(value,index) in question.choice" :key="value">
              <el-checkbox :label ="value" border disabled></el-checkbox>
          </div>

        </el-checkbox-group>
      </div>
      <div v-if="question.type =='단답'">
        유형: 단답
        <br><br>
        문제: {{ question.question }}
        <br>
      </div>
       <div v-if="question.type =='서술'">
        유형: 서술
        <br><br>
        문제: {{ question.question }}
        <br>
      </div>

      <br>
        키워드:
        <span v-for="(value,index) in studentQuestionKeywords" :key="value">{{ value.keyword }} : {{ value.score_portion}}점 </span>
      <br><br>

      <span v-for="(value,index) in score" :key="value">
            <el-button @click="onClick('SCORE',index)">{{ value }}</el-button>
      </span>
     
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
  // name: QuizEstimate,
   data() {
      return {
        result: [],
        check: true,
        score: [1,2,3,4,5],

      }
   },
  computed : {
    ...mapState('studentQuestion',[
      'studentQuestionKeywords','dialogVisible'
      
    ]),
  },
  watch: {
    question: function(newVal, oldVal) {
      const vm = this;
      vm.result = [];
      if (vm.question.type === '객관') {
        const answer = vm.question.answer;
        const choice = vm.question.choice;
        for (let i = 0 ; i < choice.length ; i += 1) {
          if (answer.includes(choice[i])) {
            let obj = { choice: choice[i], check: true };
            vm.result.push(obj);
          } else {
            let obj = { choice: choice[i], check: false };
            vm.result.push(obj);
          }
        }
      }
      alert(`keywords - ${JSON.stringify(vm.studentQuestionKeywords)}`);
 
    }
  },
  async mounted() {
    const vm = this;
    vm.result = [];
    if (vm.question.type === '객관') {
      const answer = vm.question.answer;
      const choice = vm.question.choice;
      for (let i = 0 ; i < choice.length ; i += 1) {
        if (answer.includes(choice[i])) {
          let obj = { choice: choice[i], check: true };
          vm.result.push(obj);
        } else {
          let obj = { choice: choice[i], check: false };
          vm.result.push(obj);
        }
      }
    }

  },
  created() {

    
  },
  methods: {
    ...mapActions('studentQuestion', ['postStudentQuestionScore']),
    ...mapMutations('studentQuestion', ['updateDialogVisible']),
    async onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'SCORE': {
          
          // alert(`score - ${vm.score[index]}`);
          // alert(`current question - ${JSON.stringify(vm.question)}`);
          await vm.postStudentQuestionScore({ id: vm.question.lecture_id, qId: vm.question.student_question_id, score: vm.score[index]})
          vm.updateDialogVisible({ value: false });

          break;
        }
        default: {
          break;
        }
      }

    },
  },
  props: [`question`],

}
</script>
<style>
 .question {
   background-color: blanchedalmond;
 }
 .answer {
  
 }
 .form {
   background-color: #e5e9f2;
 }
</style>