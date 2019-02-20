<template functional>
  <div id="lecture_list_wrapper">
    <div v-if="props.list.length === 0">
      생성된 강의가 없습니다.
    </div>
    <div v-else>
      <el-table :data="props.list" @row-click="listeners['row-click']" class="elTable-label">
        <el-table-column
          prop="index"
          label="번호"
          width="90"
          align="left"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="유형"
          width="90"
          align="left"
        ></el-table-column>

        <template v-if="props.type === 'TEACHER'">
            <el-table-column
              prop="name"
              label="강의명"
              align="left"
            ></el-table-column>
            <el-table-column
            label="기간"
            width="230"
            align="left"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.type !== '[유인]'">
                <div v-if="scope.row.type === '[무인]단체'">
                  {{ scope.row.start_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') + ' / ' +
                    new Date(scope.row.start_time).toLocaleTimeString('ko-KR') : '미정' }}
                </div>
                <div v-if="scope.row.type === '[무인]개인'">
                  {{ scope.row.end_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') : '미정' }}
                  ~
                  {{ scope.row.end_time ? new Date(scope.row.end_time).toLocaleDateString('ko-KR') : '미정' }}
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- TODO
          <el-table-column
            label="수강 학생 수"
            width="135"
             align="left"
          >
            <template slot-scope="scope">
              몇명 / {{ scope.row.capacity }}
            </template>
          </el-table-column>

          <el-table-column
            label="수강 이해도(평균)"
            width="135"
             align="left"
          >
            <template slot-scope="scope">
              몇%
            </template>
          </el-table-column>
          -->

          <el-table-column
            label="-"
            width="115"
            align="left"
          >
            <template slot-scope="scope">
              <router-link :to="`/a/teacher/NNlecture/${scope.row.lecture_id}/live?classId=${scope.row.class_id}`">
                <el-button>강의하기</el-button>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column
            v-if="!props.isPhone"
            label="-"
            width="90"
            align="left"
          >
            <template slot-scope="scope">
              <router-link :to="`/a/teacher/NNlecture/${scope.row.lecture_id}/manage?classId=${scope.row.class_id}`">
                <el-button class="edit-btn">수정</el-button>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column
            label="-"
            width="90"
            align="left"
          >
            <template slot-scope="scope">
              <el-button type="danger" @click="listeners['delete'](scope.$index)">삭제</el-button>
            </template>
          </el-table-column>
        </template>

        <template v-if="props.type === 'STUDENT'">
          <el-table-column
            prop="name"
            label="강의"
            align="center"
          ></el-table-column>
          <el-table-column
            label="활성화 시간"
            width="300"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.type !== '[유인]'">
                <div v-if="scope.row.type === '[무인]단체'">
                  {{ scope.row.start_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') + ' / ' +
                    new Date(scope.row.start_time).toLocaleTimeString('ko-KR') : '미정' }}
                </div>
                <div v-if="scope.row.type === '[무인]개인'">
                  {{ scope.row.end_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') : '미정' }}
                  ~
                  {{ scope.row.end_time ? new Date(scope.row.end_time).toLocaleDateString('ko-KR') : '미정' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="수강여부"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.heard }}
            </template>
          </el-table-column>
          <el-table-column
            label="-"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-button @click="listeners['join'](scope.$index)">강의보기</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="강의별 문제"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <router-link :to="`/a/student/NNclass/${scope.row.class_id}/quiz?lectureId=${scope.row.lecture_id}`">
                <el-button>출제</el-button>
              </router-link>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
// TODO : 몇명, 몇% 실제 값 대입
import isArray from 'lodash.isarray';

export default {
  name: 'LectureList',
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        const allowedTypeList = ['TEACHER', 'STUDENT'];
        if (!allowedTypeList.includes(value)) {
          // eslint-disable-next-line no-console
          console.error(`prop "type" should be one of ${allowedTypeList}`);
          return false;
        }
        return true;
      },
    },
    list: {
      type: Array,
      required: true,
      validator(value) {
        if (!isArray(value)) {
          // eslint-disable-next-line no-console
          console.error('prop "list" should be type Array');
          return false;
        }
        if (value.length === 0) {
          return true;
        }
        const firstElement = value[0];
        const allowedKeyOfClassListItem = ['id']; // TODO: improve this list
        const firstElementKeySet = new Set(Object.keys(firstElement));
        if (firstElementKeySet.size === 0) {
          throw new Error('ClassList empty element received.');
        }
        for (let i = 0; i < allowedKeyOfClassListItem; i += 1) {
          const expectedKey = allowedKeyOfClassListItem[i];
          if (!firstElementKeySet.has(expectedKey)) {
            // eslint-disable-next-line no-console
            console.error(`prop "list" should have \`${expectedKey}\``);
            return false;
          }
        }
        return true;
      },
    },
    isPhone: {
      type: null,
    },
  },
};
</script>

<style lang="scss" scoped>
#lecture_list_wrapper {
  .elTable-label {
  font-family: SpoqaHanSans;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #909399;
  text-align: center;
  }
.elTable-label th {
  font-family: SpoqaHanSans;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #909399;
}
.elTable-label td {
  font-family: SpoqaHanSans;
  font-size: 20px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #606266;

}
.edit-btn {
  font-family: SpoqaHanSans;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #1989fa;
}
}
</style>
