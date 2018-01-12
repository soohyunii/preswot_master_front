<template>
    <div>
        <el-container>
            <el-aside width="100px"></el-aside>
            <el-main>
                <!-- TODO: translation -->
                자바 4강(배열)<hr>
                <el-row>
                    <el-col :span="12">
                        <div>영상이 들어가는 공간</div>
                    </el-col>
                    <el-col :span="12">
                       <student-realtime-summary></student-realtime-summary>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div>문제가 들어가는 공간<hr></div>
                    </el-col>
                    <el-col :span="12">
                        <div>강의자료<hr></div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import StudentRealtimeSummary from '../partial/StudentRealtimeSummary';

export default {
  name: 'StudentRealtime',
  components: {
    StudentRealtimeSummary,
  },
};
</script>
