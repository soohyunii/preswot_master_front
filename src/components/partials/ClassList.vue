<template functional>
  <div id="class_list_wrapper">
    <div v-if="props.list.length === 0">
      강의 중인 과목이 없습니다.
    </div>
    <div v-else>
      <el-table :data="props.list" stripe @row-click="listeners['row-click']">
        <el-table-column
          prop="index"
          label="과목 번호"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="과목"
          width="225"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="description"
          label="과목 소개"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.description | truncate(20) }}
          </template>
        </el-table-column>

        <el-table-column
          label="기간"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.start_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') : '미정' }}
            ~
            {{ scope.row.end_time ? new Date(scope.row.end_time).toLocaleDateString('ko-KR') : '미정' }}
          </template>
        </el-table-column>

        <el-table-column
          label="-"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <router-link :to="`/a/teacher/NNclass/${scope.row.class_id}/edit`">
              <el-button>수정</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="-"
          width="120"
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
