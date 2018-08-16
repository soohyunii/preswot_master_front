<template functional>

  <div id="lecture_item_list_wrapper">
    <div v-if="props.list.length === 0">
      강의 아이템 목록이 비었습니다.
    </div>
    <div v-else>
      <el-table :data="props.list"
                row-key="sequence"
                sortable
                v-sortable="data.attrs.sortableOptions">
        <el-table-column
          type="index"
          label="번호"
          width="100"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="type"
          label="타입"
          width="100"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="name"
          label="강의 아이템 이름"
          width="225"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="activeTime"
          label="활성화 시간"
          width="500"
          align="center"
        >
          // TODO:
        </el-table-column>

        <el-table-column
          label="-"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="small" @click="listeners['edit'](scope.row.lecture_item_id)">수정</el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="-"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="small" @click="listeners['simulate'](scope.row.lecture_item_id)">미리보기</el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="-"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="listeners['delete'](scope.$index)">삭제</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LectureItemList',
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
        if (!Array.isArray(value)) {
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
