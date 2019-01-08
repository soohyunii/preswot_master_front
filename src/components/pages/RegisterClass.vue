<template>
  <div id="teacher_class_new_wrapper" class="bt-container">
     <div class="page-title">
      <template v-if="isEdit">
        과목 수정
      </template><template v-else>
        등록하기 > 과목
      </template>
    </div>
    <el-form :model="input" ref="elForm" label-position="left" label-width="125px" style="max-width: 800px;" class="elForm-label">
      <br/><br/><br/><br/><br/><br/>
      <el-form-item label="대학선택">
        <el-select v-model="input.university_name" @change="categoryChange()">
          <!-- <option value="">대학리스트</option> -->  <!-- DB에 있는 대학 리스트 가져오기 --> 
          <el-option 
            v-for="university_name in input.university_list"
            :label="university_name"
            :value="university_name">
          </el-option>
        </el-select> &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="학과선택">
        <el-select v-model="input.department_name" :disabled="input.boolean" @change="categoryTeacherChange()">
          <el-option 
            v-for="department_name in input.department_list"
            :label="department_name"
            :value="department_name">  
          </el-option>
        </el-select>
        <el-checkbox v-model="input.checked" style="margin-left:20px;" @change="categoryNone()">소속 없음</el-checkbox> 
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="과목코드">
        <el-input v-model="input.code" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="과목명">
        <el-input v-model="input.name" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="과목 상세 소개">
        <el-input type="textarea" :rows="6" v-model="input.description" class="subject-description"></el-input>
      </el-form-item>

      <el-form-item label="기본과목으로 등록">
        <el-switch v-model="input.isActive"></el-switch>
      </el-form-item>

      <br/><br/><br/><br/><br/><br/>
      <el-form-item label="강사선택">
        <el-select id="teacher-choice" v-model="input.teacher_email_id" :disabled="input.isActive" style="width:140px;">
          <el-option 
            v-for="teacher_email_id in input.teacher_list"
            :label="teacher_email_id"
            :value="teacher_email_id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="과목차수">
        <el-input type="number" v-model="input.day_of_week" class="subject-title" :disabled="input.isActive"></el-input>
      </el-form-item>

      <el-form-item label="강의시간">
        <!-- <el-input v-model="input.time" class="subject-title" :disabled="input.isActive"></el-input> -->
        <el-time-picker v-model="input.start_time" format="HH:mm" value="HH:mm" class="subject-startDate" :disabled="input.isActive"></el-time-picker>
        ~
        <el-time-picker v-model="input.end_time" format="HH:mm" value="HH:mm" class="subject-startDate" :disabled="input.isActive"></el-time-picker>
      </el-form-item>

      <el-form-item label="강의공간">
        <el-input v-model="input.location" class="subject-title" :disabled="input.isActive"></el-input>
      </el-form-item>

      <el-form-item label="강의 기간">
        <el-date-picker
          v-model="input.start_date"
          type="datetime" class="subject-startDate" :disabled="input.isActive"
        >
        </el-date-picker>
         ~
         <el-date-picker
          v-model="input.end_date"
          type="datetime" class="subject-endDate" :disabled="input.isActive"
        >
        </el-date-picker>
      </el-form-item>

      <!-- <el-form-item label="정원">
        <el-input type="number" v-model.number="input.capacity" :disabled="input.capacityCheck" class="subject-capacity"></el-input>
      </el-form-item> -->

      <el-form-item label="정원">
        <el-input type="number" v-model.number="input.capacity" :disabled="input.isActive" class="subject-capacity"></el-input>
      </el-form-item>

      <!-- <el-form-item label="정원 제한 없음">
        <el-switch v-model="input.capacityCheck" :disabled="input.isActive"></el-switch>
      </el-form-item> -->

      <!-- <el-form-item label="강사 소개">
        <el-input type="textarea" :rows="3" v-model="input.lecturerDescription" class="teacher-description" :disabled="input.isActive"></el-input>
      </el-form-item> -->

      <el-form-item>
        <!-- TODO: use button loading -->
        <br/>
        <el-button
          type="primary"
          @click="onSubmit"
          class="subject-btn"
        >
          <template v-if="isEdit">
            과목 수정
          </template><template v-else>
            등록하기
          </template>
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import masterService from '../../services/masterService';
import authService from '../../services/authService';
import utils from '../../utils';

export default {
  name: 'RegisterClass',
  async created() {
    const vm = this;
    // 학생이 url로 접근하는 경우 방지
    const accessId = utils.getUserIdFromJwt();
    const accessCheck = await authService.returnUserInfo({
      userID: accessId,
    });
    if (accessCheck.data.userInfo.type === 0) {
      vm.$router.push('/');
    }
  },
  data() {
    const initialInput = {
      /*class_id:'',*/
      university_list: '',
      department_list: null,
      teacher_list: '',
      code: '',
      isActive: false,
      day_of_week: '',
      name: '',
      start_time: '',
      end_time: '',
      location: '',
      start_date: new Date(),
      end_date: new Date(),
      capacity: 0, // 0은 무제한
      // capacityCheck: false,
      // lecturerDescription: '',
      description: '',
      // select 상자는 여기에 명시해야 할까?
    };
    return {
      initialInput,
      input: Object.assign({}, initialInput), // 복사해서 넣음
    };
  },
  async mounted() {
    const vm = this;
    const uniNameLists = await masterService.getUniNameLists();
    // console.log('20181211 unniNameLists?????????????==',uniNameLists);
    vm.input.university_list = uniNameLists.data.map(element => element.name);
    
    if (vm.isEdit) {
      const res = await masterService.getMasterClass({ class_id: vm.classId });
      // console.log(class_id);
      // console.log('res', res.data);
      vm.input.university_name = res.data.university_name || vm.initialInput.university_name;
      vm.input.department_name = res.data.department_name || vm.initialInput.department_name;
      vm.input.teacher_email_id = res.data.teacher_email_id || vm.initialInput.teacher_email_id;
      /*vm.input.teacher_list = res.data.teacher_list || vm.initialInput.teacher_list;*/
      vm.input.code = res.data.code || vm.initialInput.code;
      vm.input.day_of_week = res.data.day_of_week || vm.initialInput.day_of_week;
      vm.input.name = res.data.name || vm.initialInput.name;
      vm.input.start_time = res.data.start_time || vm.initialInput.start_time;
      vm.input.end_time = res.data.end_time || vm.initialInput.end_time;
      vm.input.location = res.data.location || vm.initialInput.location;
      vm.input.start_date = res.data.start_time || vm.initialInput.start_date;
      vm.input.end_date = res.data.end_time || vm.initialInput.end_date;
      vm.input.capacity = res.data.capacity || vm.initialInput.capacity; // 0은 무제한
      // vm.input.capacityCheck = vm.input.capacity === 0;
      // vm.input.lecturerDescription = res.data.lecturer_description;
      // vm.input.isActive = res.data.isActive || vm.initialInput.isActive;
      vm.input.description = res.data.description;
      // 필수입력요소 미입력시 '*는 필수입력사항입니다 알람'
    }
  },
  computed: {
    isEdit() {
      const vm = this;
      return vm.$route.fullPath.includes('/edit');
    },
    classId() {
      const vm = this;
      return vm.$route.path.split('class/')[1].split('/edit')[0];
    },
  },
  methods: {
    onSubmit() {
      const vm = this;
      vm.$refs.elForm.validate(async (/* valid, fields */) => {
        // console.log('valid,', valid);
        // console.log('fields', fields);
        // TODO: if valid === true 로 감싸기
        // TODO: valid === false인 경우에 notify
        if (vm.isEdit) {
          const id = vm.classId;
          // TODO: wrap with try catch
          try {
            await masterService.NNMasterputClass({
              class_id: id,
              ...vm.input,
            });
            vm.$router.push('/a/view/class');
          } catch (error) {
            vm.$notify({
              title: '과목 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        } else {
          // TODO: wrap with try catch
          try {
            await masterService.NNMasterpostClass(vm.input);
            if(vm.input.university_name==''||vm.input.department_name==''||vm.input.code==''){
              vm.$notify({
                title: '과목 등록 실패',
                message: '필수입력사항(*)을 모두 기재해 주세요',
                type: 'error',
                duration: 0, 
              }); 
            } else {
              console.log(vm.input);
              // console.log('1111');
              vm.$router.push('/a/register/class/success');
              /*console.log('2222');*/
            }
          } catch (error) {
            console.log(vm.input);
            vm.$notify({
              title: '과목 등록 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        }
      });
    },
    async categoryChange(){
      const vm=this;
      const deptNameLists = await masterService.getDeptLists({name : vm.input.university_name});
      console.log('deptNameLists',deptNameLists);
      vm.input.department_list = await deptNameLists.data.map(element=>element.name);
    },
    async categoryTeacherChange(){
      const vm=this;
      const teacherNameLists = await masterService.getUserLists(1,vm.input.university_name,vm.input.department_name);
      console.log(teacherNameLists);
      vm.input.teacher_list = await teacherNameLists.data.map(element=>element.name);
      console.log(vm.input.teacher_list);
    },
    async categoryNone(){
      const vm=this;
      if(vm.input.checked==true){
        vm.input.boolean=true;
      } else {
        vm.input.boolean=false;
      }
      const teacherNameLists = await masterService.getUserLists(1,vm.input.university_name,vm.input.department_name);
      vm.input.teacher_list = await teacherNameLists.data.map(element=>element.name);
    },
  },
  watch: {
    // NOTE: 이거 () => {}로 바꾸면 안됨!! vm이 다른 녀석 들어옴
    /*'input.capacityCheck': function handler(newVal) {
      const vm = this;
      if (newVal) {
        vm.input.capacity = 0;
      }
    },*/
    'input.isActive' : function handler(newVal) {
      const vm = this;
      if(newVal) {
        /*vm.input.teacher_email_id='',*/
        vm.input.teacher_email_id=null,
        vm.input.day_of_week=0,
        /*vm.input.start_time='',
        vm.input.end_time='',
        vm.input.location='',*/
        vm.input.start_time=null,
        vm.input.end_time=null,
        vm.input.location=null,
        /*vm.input.start_date=false,
        vm.input.end_date=false,*/
        vm.input.start_date=null,
        vm.input.end_date=null,
        vm.input.capacity=0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#teacher_class_new_wrapper {
  column-count: 2;
}
#teacher_class_new_wrapper {
 .page-title{
    float:left;
    width:1000px;
    height: 24px;
    font-family: SpoqaHanSans;
    font-size: 25px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000000;
    margin-top : 40px;
    margin-left : 7px;
    margin-bottom : 30px;
  }
  .el-form-item__label {
    font-size: 30px;
  }
  .elForm-label el-form-item{
    text-align : left;
    font-family: SpoqaHanSans;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: normal;
    color: #000000;
  }
  .subject-title{
    width: 300px;
    height: 40px;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #dcdfe6;
    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }
  .subject-summary{
    width: 300px;
    height: 100%;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #dcdfe6;
    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }
  .subject-startDate{
    width: 140px;
    height: 40px;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #d8dce6;
    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }
  .subject-endDate{
    width: 140px;
    height: 40px;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #d8dce6;
    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }
  .subject-capacity{
      width: 300px;
    height: 40px;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #dcdfe6;
    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }
  .teacher-description{
    width: 300px;
    height: 100%;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #dcdfe6;
    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }
  .subject-description{
    width: 300px;
    height: 100%;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #dcdfe6;
    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }
  .subject-btn{
    width: 300px;
    height: 40px;
    border-radius: 3px;
    background-color: #1989fa;
    font-family: SpoqaHanSans;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }
}
</style>
