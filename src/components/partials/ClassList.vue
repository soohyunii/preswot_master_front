<template functional>
  <div id="class_list_wrapper" class="bt-container">
    <h2>강의 과목</h2>
    <div v-if="props.list.length === 0">
      강의 중인 과목이 없습니다.
    </div>
    <div v-else>
      <el-table :data="props.list" stripe>
        <el-table-column
          prop="index"
          label="번호"
          sortable
          width="70"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="과목"
          width="255"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="description"
          label="과목 소개"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.description | truncate(30) }}
          </template>
        </el-table-column>

        <el-table-column
          label="기간"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            {{ new Date(scope.row.start_time).toLocaleDateString() }} ~ {{ scope.row.end_time ? new Date(scope.row.end_time).toLocaleDateString(scope.row.end_time) : '미정' }}
          </template>
        </el-table-column>

        <el-table-column
          label="-"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button>수정</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="-"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="danger">삭제</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    번호 / 과목 / 과목소개 / 기간 / - / - <br />
    1 / 한국사 / 누가 국사 소리를 내었는가 / 어제부터 내일까지 / 수정 버튼 / 삭제 버튼 <br />
  </div>
</template>

<script>
import isArray from 'lodash.isarray';

export default {
  name: 'ClassList',
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
        const allowedKeyOfClassListItem = ['id'];
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
