/* eslint-disable react/react-in-jsx-scope */

import Vue from 'vue';
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import MyButton from './MyButton';
import Welcome from './Welcome';

Vue.component('welcome', Welcome);
Vue.component('my-button', MyButton);

storiesOf('Welcome', module).add('to Storybook', () => ({
  components: { Welcome },
  template: '<welcome :showApp="action" />',
  methods: { action: linkTo('Button') },
}));

storiesOf('Button', module)
  .add('with text', () => ({
    components: { MyButton },
    template: '<my-button @click="action">Hello Button</my-button>',
    methods: { action: action('clicked') },
  }))
  .add('with JSX', () => ({
    components: { MyButton },
    template: `
      <my-button @click="action">With JSX (replaced by olaf)</my-button>
    `,
    methods: { action: linkTo('Welcome') },
  }))
  .add('with some emoji', () => ({
    components: { MyButton },
    template:
      '<my-button @click="action"><span role="img" aria-label="so cool">😀 😎 👍 💯</span></my-button>',
    methods: { action: action('clicked') },
  }));

/* eslint-enable react/react-in-jsx-scope */
