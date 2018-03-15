<template>
  <div class="wrapper">
    <el-container>
      <el-main v-if="currentTeachingClass">
        <h2>{{ currentTeachingClass.name }}</h2><hr>

        <div v-if="needScoring && !inner">
          <h3>체점이 필요한 문항</h3>
          <el-table
            :data="needScoring.items"
            border>
            <el-table-column label="Lecture" align="center" prop="lecture_name" sortable>
            </el-table-column>
            <el-table-column label="Name" align="center" prop="lecture_item_name" sortable>
            </el-table-column>
            <el-table-column label="Type" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.type === 'long' ? 'primary' : 'success'">
                  {{ scope.row.type === 'long' ? '서술형 문항' : '숙제' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="Scoring">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick({
                   lecture_item_id: scope.row.lecture_item_id,
                   lecture_id: scope.row.lecture_id,
                   lecture_item_name: scope.row.lecture_item_name,
                   lecture_item_description: scope.row.lecture_item_description,
                   question: scope.row.question,
                   homework: scope.row.homework,
                   type: scope.row.type,
                   })"
                  type="text" size="small">
                  점수 매기기
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-if="inner">
          <el-button @click="backClick" type="primary" >다른 항목 보기</el-button>

          <div v-if="inner.type === 'long'">
            <el-row class="description">
              <el-col class="desc-name">문제 이름:</el-col>
              <el-col :span="8" class="desc-desc">{{' ' + inner.lecture_item_name}}</el-col>
            </el-row>
            <el-row class="description">
              <el-col class="desc-name">문제 설명:</el-col>
              <el-col :span="8" class="desc-desc">{{' ' + inner.question.question}}</el-col>
            </el-row>
            <el-row class="description">
              <el-col class="desc-name">답:</el-col>
              <el-col :span="8" class="desc-desc">{{' ' + inner.question.answer}}</el-col>
            </el-row>
            <el-row class="description">
              <el-col class="desc-name">배점:</el-col>
              <el-col :span="8" class="desc-desc">{{' ' + inner.question.score}}</el-col>
            </el-row>
            <el-form>
              <el-table :data="inner.question.student_answer_logs" border>
                <el-table-column label="Student ID" align="center" prop="user.email_id" sortable>
                </el-table-column>
                <el-table-column label="Answer" align="center" prop="answer">
                </el-table-column>
                <el-table-column label="Score" align="center">
                  <template slot-scope="scope">
                    <el-form-item prop="scope.row.score" class="inner-input">
                      <el-input
                        type="number"
                        v-model.lazy="scope.row.score"
                        @change="onChange('long', scope.row.student_answer_log_id,
                          scope.row.score, scope.$index)"
                        min="0"
                        :max="inner.question.score" />
                    </el-form-item>
                  </template>
                </el-table-column>

              </el-table>
            </el-form>
          </div>

          <div v-if="inner.type === 'homework'">
            <el-row class="description">
              <el-col class="desc-name">숙제 이름:</el-col>
              <el-col :span="8" class="desc-desc">{{' ' + inner.lecture_item_name}}</el-col>
            </el-row>
            <el-row class="description">
              <el-col class="desc-name">숙제 설명:</el-col>
              <el-col :span="8" class="desc-desc">{{' ' + inner.lecture_item_description}}</el-col>
            </el-row>
            <el-row class="description">
              <el-col class="desc-name">숙제 파일:</el-col>
              <el-col :span="8" class="desc-desc">
                <el-button type="text" class="download"
                           v-for="file in inner.homework.files"
                           @click="onClickDownload(file.client_path, file.name)">{{file.name}}<br>
                </el-button>
              </el-col>
            </el-row>
            <el-form>
              <el-table :data="inner.homework.student_homeworks" border>
                <el-table-column label="Student ID" align="center" prop="user.email_id" sortable>
                </el-table-column>
                <el-table-column label="Comment" align="center" prop="comment">
                </el-table-column>
                <el-table-column label="File" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" class="download"
                               v-for="file in scope.row.files"
                               @click="onClickDownload(file.client_path, file.name)">{{file.name}}<br>
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="Feedback" align="center">
                  <template slot-scope="scope">
                    <el-form-item prop="scope.row.feedback" class="inner-input">
                      <el-input
                        type="textarea"
                        v-model.lazy="scope.row.feedback"
                        @change="onChange('homework', scope.row.student_homework_id,
                          scope.row.feedback, scope.$index)"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
  main {
    min-height: 800px;
  }
  .description {
    padding: 15px 0 10px 0;
  }
  .desc-name {
    width: 100px;
    text-align: right;
    margin-right: 20px;
  }
  .inner-input {
    margin-bottom: 0;
  }
  .desc-desc {
    min-width: 400px;
  }
  .download {
    padding-top: 0;
  }
</style>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import { baseUrl } from '../../services/config';
  import utils from '../../utils';


  export default {
    name: 'TeacherClassScoring',
    computed: {
      ...mapState('class', ['teachingClassList', 'currentClassIndex', 'currentClassNeedScoring']),
      ...mapGetters('class', [
        'currentTeachingClass',
      ]),
    },
    data() {
      return {
        needScoring: null,
        inner: null,
      };
    },
    async created() {
      const vm = this;
      if (!vm.currentTeachingClass) {
        await vm.getMyClassLists();
        vm.updateCurrentClassIndex({
          currentClassId: Number.parseInt(vm.$route.params.classId, 10),
        });
        await vm.getClass({ type: 'TEACH' });
      }
      await vm.getClassNeedScoring({ type: 'TEACH' });
      vm.needScoring = vm.currentClassNeedScoring;
      console.log(vm.needScoring);
    },
    methods: {
      ...mapMutations('class', [
        'updateCurrentClassIndex',
      ]),
      ...mapActions('class', [
        'getMyClassLists',
        'getClass',
        'getClassNeedScoring',
        'putScore',
        'putHomeworkFeedback',
      ]),
      handleClick(data) {
        this.inner = data;
      },
      backClick() {
        this.inner = null;
      },
      async onChange(type, id, score, index) {
        const vm = this;
        if (type === 'long') {
          if (vm.inner.question.score < score) {
            vm.inner.question.student_answer_logs[index].score = null;
          } else {
            await vm.putScore({ id, score });
          }
        } else if (type === 'homework') {
          console.log('asdasd');
          await vm.putHomeworkFeedback({ id, feedback: score });
        }
      },
      onClickDownload(url, name) {
        utils.downloadFile(`${baseUrl}${url}`, name);
      },
    },
  };
</script>
