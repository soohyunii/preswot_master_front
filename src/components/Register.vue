<template>
  <div>
    <h2>회원가입</h2>
    <el-container>
      <el-row>
        <el-col>
          <form novalidate>
            <el-input placeholder="abc@gmail.com" v-model="input.email" type="email">
              <template slot="prepend">{{ $t('LOGIN.EMAIL') }}</template>
            </el-input>
            <el-input placeholder="********" v-model="input.password" type="password">
              <template slot="prepend">{{ $t('LOGIN.PASSWORD') }}</template>
            </el-input>
            <el-input placeholder="********" v-model="input.password2" type="password">
              <template slot="prepend">{{ $t('LOGIN.PASSWORD') }} 2</template>
            </el-input>

            <br />
            <br />

            <el-input placeholder="홍길동" v-model="input.name" type="string">
              <template slot="prepend">Name</template>
            </el-input>

            <!-- TODO: 생년월일 -->
            <!-- http://element.eleme.io/#/en-US/component/date-picker -->
            <template>{{ $t('LOGIN.BIRTH') }}</template>
            <el-date-picker placeholder="Pick a day" value-format="yyyy-MM-dd" v-model="input.birth" type="date">
            </el-date-picker>

            <!--
            <el-input placeholder="1990-01-01" v-model="input.birth" type="date" v-show="true">
              <template slot="prepend">{{ $t('LOGIN.BIRTH') }}</template>
            </el-input> -->

            <!-- TODO: 주소 -->
            <!-- http://postcode.map.daum.net/guide -->
            <el-input placeholder="postcode" v-model="input.postcode" type="string" v-show="true">
              <template slot="prepend">우편번호</template>
            </el-input>
            <el-input placeholder="address" v-model="input.address" type="string" v-show="true">
              <template slot="prepend">도로명주소</template>
            </el-input>
            <el-input id="detail" placeholder="detail addr" v-model="input.address2" type="string" v-show="true">
              <template slot="prepend">상세주소</template>
            </el-input>
            <el-input type="string" v-show="true" :value="input.total_addr" disabled>
              <template slot="prepend">{{ $t('LOGIN.ADDRESS') }}</template>
              {{total_addr}}
            </el-input>
            <el-button type="primary" @click="execDaumPostcode()">{{ $t('LOGIN.ADDR_SEARCH') }}</el-button>

            <!-- TODO: 핸드폰 번호 -->
            <!-- 핸드폰 번호 인증 어떻게?? -->
            <!-- 010-1234-1234 로 포매팅도 있어야 할듯 -->
<<<<<<< HEAD
            <el-input placeholder="010-1234-1234" v-model="input.phone" v-mask="['###-####-####', '##-###-####', '###-###-####']" type="tel">
=======
            <el-input placeholder="010-1234-1234" v-model="input.phone" v-mask="['###-####-####', '###-###-####']" type="tel">
>>>>>>> LSB
              <template slot="prepend">{{ $t('LOGIN.PHONE') }}</template>
            </el-input>
            <el-button type="primary" @click="dummy()">인증번호</el-button>

            <!-- TODO: 전공 -->
            <!-- Just simple input -->
            <el-input placeholder="국어국문" v-model="input.major" type="string">
              <template slot="prepend">{{ $t('LOGIN.MAJOR') }}</template>
            </el-input>

            <!-- TODO: 소속 -->
            <!-- Just simple input -->
            <el-input placeholder="문과대학" v-model="input.belong" type="string">
              <template slot="prepend">{{ $t('LOGIN.BELONG') }}</template>
            </el-input>

            <el-button type="primary" @click="onClick('LOGIN')">회원가입</el-button>
            <br />
            <pre>{{ input | json }}</pre>
          </form>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
// id(string), password(string), name(string),
// birth(1991-07-16 형식string), address(string), phone(string), major(string), belong(string소속)
export default {
  name: 'Register',
  data() {
    return {
      input: {
        email: 'adoji92@gmail.com',
        password: 'adojiadoji',
        password2: 'adojiadoji',
        name: '안동진',
        birth: '1990-12-31',
        postcode: '03722',
        address: '서울 서대문구 연세로 50 (연세대학교)',
        address2: '제4 공학관 811호',
        total_addr: '',
        phone: '010-1234-1234',
        major: '컴퓨터과학',
        belong: '공과대학',
      },
    };
  },
  computed: {
    total_addr() {
      const vm = this;
      // eslint-disable-next-line
      vm.input.total_addr = vm.input.address + ' ' + vm.input.address2 + ' ' + vm.input.postcode;
      return vm.input.total_addr;
    },
  },
  methods: {
    execDaumPostcode() {
      /* eslint-disable */
      const vm = this;
      new daum.Postcode({
        oncomplete(data) {
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

          // 각 주소의 노출 규칙에 따라 주소를 조합한다.
          // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
          var fullAddr = ''; // 최종 주소 변수
          var extraAddr = ''; // 조합형 주소 변수

          // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            fullAddr = data.roadAddress;

          } else { // 사용자가 지번 주소를 선택했을 경우(J)
            fullAddr = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
          if(data.userSelectedType === 'R'){
            //법정동명이 있을 경우 추가한다.
            if(data.bname !== ''){
              extraAddr += data.bname;
            }
            // 건물명이 있을 경우 추가한다.
            if(data.buildingName !== ''){
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
            fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
          }

          // 우편번호와 주소 정보를 해당 필드에 넣는다.
          vm.input.postcode = data.zonecode; //5자리 새우편번호 사용
          vm.input.address = fullAddr;

          // 커서를 상세주소 필드로 이동한다.
          document.getElementById('detail').focus();
        }
      }).open();
    }
  },
};
</script>

<style lang="scss" scoped>
h2 {
  color: red;
}
</style>



