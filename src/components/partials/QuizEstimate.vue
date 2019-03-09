<template>
  <div class="form">
    <br>
    <div class="question">
      {{ question.question }}
    </div>
    <br><br>
    <div class="answer">
      <div v-if="question.type =='객관'">
        <el-checkbox-group v-model="result" size="small">
          <div v-for="(value,index) in result" :key="value">
            <!-- <div v-if="value.check ===true">
              <el-checkbox v-model="value.check" border disabled>{{ value.choice }}</el-checkbox>
            </div>
            <div v-else>
              <el-checkbox border disabled>{{ value.choice }}</el-checkbox>

            </div> -->
              <el-checkbox v-model="check" border disabled>{{ value.choice }}</el-checkbox>

          </div>
        </el-checkbox-group>
        <!-- <li v-for="(value,index) in question.choice" :key="value">
          {{ index+1 }}-{{ value}}
        </li> -->
      </div>
      <div v-if="question.type =='단답'">
        단답형
      </div>
       <div v-if="question.type =='서술'">
        {{ question.answer }}
      </div>

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
    ...mapState('studentQuestion',['studentQuestionKeywords','dialogVisible']),
   
  },
  created() {
    const vm = this;
    // alert(`created -dd ${JSON.stringify(vm.question)}`);
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
  methods: {
    ...mapMutations('studentQuestion', ['updateDialogVisible']),
    async onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'SCORE': {
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
   background-color: cornflowerblue;
 }
</style>