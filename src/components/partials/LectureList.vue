<template functional>
  <div id="lecture_list_wrapper">
    <div v-if="props.list.length === 0">
      생성된 강의가 없습니다.
    </div>
    <div v-else>
      <!-- {{ props.list }}<br /> -->

      <!-- 번호(1), 타입(숙제), 강의(근대사 1강), 기간, 수강한 학생수, 수강생 이해도(평균), 강의, 관리, 삭제 -->
      <el-table :data="props.list" stripe @row-click="listeners['row-click']">
        <el-table-column
          prop="index"
          label="강의 번호"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="타입"
          width="90"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="name"
          label="강의"
          width="225"
          align="center"
        ></el-table-column>

        <el-table-column
          label="기간"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.intended_start ? new Date(scope.row.intended_start).toLocaleDateString('ko-KR') : '미정' }}
            ~
            {{ scope.row.intended_end ? new Date(scope.row.intended_end).toLocaleDateString('ko-KR') : '미정' }}
          </template>
        </el-table-column>

        <el-table-column
          label="수강한 학생 수"
          width="110"
        >
          <template slot-scope="scope">
            몇명 / 몇명
          </template>
        </el-table-column>

        <el-table-column
          label="수강생 이해도"
          width="110"
        >
          <template slot-scope="scope">
            몇%
          </template>
        </el-table-column>

        <el-table-column
          label="-"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <router-link :to="`/a/teacher/NNlecture/${scope.row.lecture_id}/live`">
              <el-button>강의</el-button>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column
          label="-"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <router-link :to="`/a/teacher/NNlecture/${scope.row.lecture_id}/manage`">
              <el-button>관리</el-button>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column
          label="-"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="danger" @click="listeners['delete'](scope.$index)">삭제</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
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
  },
};
</script>

