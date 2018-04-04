import { configure } from '@storybook/vue';
import Vue from 'vue';
import kebabCase from 'lodash.kebabcase';

// automatically import all files ending in *.stories.js
const req = require.context('../src/stories', true, /.stories.js$/);
function loadStories() {
  console.log('req keys', req.keys());
  req.keys().forEach(filename => req(filename));
}

// add vue components
const req2 = require.context('../src/components', true, /.vue$/);
req2.keys().forEach((filename) => {
  const vueComponent = req2(filename);
  console.log(1111, filename, vueComponent);
  const tokens = filename.split('/');
  const shortFilename = tokens[tokens.length - 1].replace('.vue', '');
  Vue.component(kebabCase(shortFilename), vueComponent);
})

configure(loadStories, module);
