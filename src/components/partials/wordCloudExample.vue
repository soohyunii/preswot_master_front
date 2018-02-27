<template>
  <div id="app" class="wrapper animated faidIn">
      <wordcloud
        class="wordCloud"
        :data="words"
        nameKey="name"
        valueKey="value"
        fontScale="sqrt"
        :fontSize="[20, 120]"
        :wordClick="wordClick">
      </wordcloud>
      <el-button @click="showOnlyUnderstand()">이해한 것만</el-button>
  </div>
</template>

<script>
// import wordcloud from 'vue-wordcloud';
import wordcloud from './wordCloud';

export default {
  name: 'wordCloudExample',
  components: {
    wordcloud,
  },
  methods: {
    wordClick(word) {
      // 글자 클릭시 실행되는 함수
      window.console.log(word);
    },
    showOnlyUnderstand() {
      const vm = this;
      vm.userUnderstandWordCloud = !vm.userUnderstandWordCloud;
      const notUnderstandClass = document.getElementsByClassName('notUnderstand');
      const understandClass = document.getElementsByClassName('understand');
      if (vm.notUnderstandWordColor.length === 0) {
        for (let i = 0; i < notUnderstandClass.length; i += 1) {
          vm.notUnderstandWordColor.push(notUnderstandClass.item(i).style.fill);
        }
      }
      for (let i = 0; i < notUnderstandClass.length; i += 1) {
        notUnderstandClass.item(i).style.opacity = vm.userUnderstandWordCloud ? '0.1' : '1';
        notUnderstandClass.item(i).style.fill = vm.userUnderstandWordCloud ? 'gray' : vm.notUnderstandWordColor[i];
      }
      for (let i = 0; i < understandClass.length; i += 1) {
        understandClass.item(i).style.textShadow = vm.userUnderstandWordCloud ? '0 0 5px #000' : '';
      }
    },
  },
  computed: {
    /*
    words() {
      const wordarr = [];
      for (let i = 0; i < 150; i += 1) {
        let name = '';
        const randChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const randLength = Math.ceil((Math.random() * 6) + 2);
        for (let j = 0; j < randLength; j += 1) {
          name += randChar.charAt(Math.floor(Math.random() * randChar.length));
        }
        // const name = Math.ceil(Math.random() * 100).toString();
        const rand = Math.random();
        const value = rand > 0.7 ? Math.ceil(rand * 50) : Math.ceil(rand * 10);
        const understand = Math.random() > 0.5 ? ' notUnderstand' : ' understand';
        wordarr.push({ name, value, understand });
      }
      return wordarr;
    }, */
    words() {
      const vm = this;
      // TODO: 이해여부 값 수정 필요
      return vm.keywords.map(item => ({
        name: item.name,
        value: item._size, // eslint-disable-line
        understand: Math.random() > 0.5 ? ' notUnderstand' : ' understand',
      }));
    },
  },
  data() {
    return {
      userUnderstandWordCloud: false,
      notUnderstandWordColor: [],
    };
  },
  props: ['keywords'],
};
</script>

<style lang="scss" scope>
  .wordCloud {
    min-height: 500px;
  }
</style>

<style>
.wrapper {
  height: 1200px;
}
.animated {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeIn {
  0% {opacity: 0;}
  100% {opacity: 1;}
}

@keyframes fadeIn {
  0% {opacity: 0;}
  100% {opacity: 1;}
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}
</style>

