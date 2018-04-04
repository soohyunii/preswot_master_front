import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import LandingPage from '@/components/pages/LandingPage';

storiesOf('LandingPage', module)
  .add('test', () => ({
    components: { LandingPage },
    template: `<landing-page />`,
  }));