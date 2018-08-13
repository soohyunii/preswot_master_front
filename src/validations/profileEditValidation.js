export default function editeRule(vm) {
  return {
    password: [
      {
        required: false,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
      {
        validator(rule, value, callback) {
          if (!vm.changepw) {
            callback();
          }
          const checkNumber = value.search(/[0-9]/g);
          const checkEnglish = value.search(/[a-z]/ig);
          if (!vm.input.password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)) {
            callback(new Error(vm.$t('FORM.ERR_LENGTH')));
          } else if (checkNumber < 0 || checkEnglish < 0) {
            callback(new Error(vm.$t('FORM.ERR_TYPE_PASSWORD')));
          } else if (vm.input.password2 !== '') {
            vm.$refs.elForm.validateField('password2');
          }
          callback();
        },
        trigger: 'change,blur',
      },
    ],
    password2: [
      {
        required: false,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
      {
        validator(rule, value, callback) {
          if (!vm.changepw) {
            callback();
          }
          if (value !== vm.input.password) {
            callback(new Error(vm.$t('LOGIN.ERR_PASSWORD_MATCH')));
          } else {
            callback();
          }
        },
        trigger: 'change,blur',
      },
    ],
    name: [
      {
        required: true,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
    ],
    sex: [
      {
        required: true,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
      {
        validator(rule, value, callback) {
          // console.log(value.match); // type of `value` = Date, not String
          window.setTimeout(() => {
            const strValue = document.getElementById('user_sex_input').value;
            if (strValue === null) {
              const errMsg = vm.$t('REG.ERR_SEX_REQUIRED');
              callback(new Error(errMsg));
            } else {
              callback();
            }
          }, 500);
        },
        trigger: 'change',
      },
    ],
    phoneNumber: [
      {
        required: true,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
      {
        validator(rule, value, callback) {
          const pattern = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
          if (!pattern.test(value)) {
            const errMsg = vm.$t('FORM.ERR_TYPE_PHONE_NUMBER');
            callback(new Error(errMsg));
          } else {
            callback();
          }
        },
        trigger: 'change,blur',
      },
    ],
    belong: [
      {
        required: true,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
    ],
    birth: [
      {
        required: true,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
      {
        validator(rule, value, callback) {
          // console.log(value.match); // type of `value` = Date, not String
          window.setTimeout(() => {
            const strValue = document.getElementById('user_birthday_input').value;
            if (strValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
              callback();
            } else {
              const errMsg = vm.$t('FORM.ERR_TYPE_DATE');
              callback(new Error(errMsg));
            }
          }, 500);
        },
        trigger: 'change',
      },
    ],
    address1: [
      {
        required: false,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
    ],
    address2: [
      {
        required: false,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
    ],
    major: [
      {
        required: true,
        message: vm.$t('FORM.ERR_REQUIRED'),
        trigger: 'change,blur',
      },
    ],
  };
}
