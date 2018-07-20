<template functional>
  <div id="lecture_item_list_wrapper">
    <div v-if="props.list.length === 0">
      강의 아이템 목록이 비었습니다.
    </div>
    <div v-else>
      <!-- {{ props.list }} -->
      <b-table :data="props.list"
                v-sortable="data.attrs.sortableOptions">
        <template slot-scope="props">
          <b-table-column
            field="index"
            label="번호"
            width="100"
            align="center"
          >
            {{ props.index + 1 }}
          </b-table-column>

          <b-table-column
            field="type"
            label="타입"
            width="100"
            align="center">
            {{ props.row.type }}
          </b-table-column>

          <b-table-column
            field="name"
            label="강의 아이템 이름"
            width="225"
            align="center">
            {{ props.row.name }}
          </b-table-column>

          <b-table-column
            prop="activeTime"
            label="활성화 시간"
            width="500"
            align="center"
          >
            // TODO:
          </b-table-column>

          <b-table-column
            label="-"
            width="80"
            align="center">
            <!-- <template slot-scope="scope"> -->
            <el-button @click="listeners['edit'](props.row.lecture_item_id)">수정</el-button>
            <!-- </template> -->
          </b-table-column>

          <b-table-column
            label="-"
            width="80"
            align="center"
          >
            <!-- <template slot-scope="scope"> -->
            <el-button type="danger" @click="listeners['delete'](props.index)">삭제</el-button>
            <!-- </template> -->
          </b-table-column>
        </template>
      </b-table>
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
