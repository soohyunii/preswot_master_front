<template>
  <div v-if="!loading" class="dump-con">
    <h3>덤프 파일
      <el-button type="primary" @click="dump">만들기
        <i class="el-icon-upload el-icon-right"></i>
      </el-button>
    </h3>
    <hr />
    <h3>Restore</h3>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        label="File"
      >
        <template slot-scope="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
      <el-table-column
        label="Delete"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="Restore"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="restore(scope.row)">Restore</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div v-else>
    <i class="el-icon-loading"> </i>
  </div>
</template>

<script>
  import http from '../../services/http';

  export default {
    name: 'Dump',
    data() {
      return {
        list: [],
        loading: false,
      };
    },
    async mounted() {
      const t = await http.get('/dump/');
      this.list = t.data.list;
    },
    methods: {
      async handleDelete(sel) {
        const t = await http.post('/dump/delete', {
          sel,
        });
        this.list = t.data.list;
      },
      async dump() {
        const t = await http.get('/dump/dump');
        this.list = t.data.list;
      },
      async restore(sel) {
        this.loading = true;
        await http.post('/dump/reset', {
          sel,
        });
        this.loading = false;
      },
    },
  };
</script>

<style scoped>
  .dump-con {
    padding: 50px 100px 0 100px;
  }
</style>
