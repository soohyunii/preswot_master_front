import Test from '../components/TestComponent';

export default function authRoutes(root) {
  return [
    {
      path: '/home',
      name: 'Home',
      component: Test, // TODO: replace dummy with real component
      meta: {
        title: 'Home', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/admin-home',
      name: 'AdminHome',
      component: Test, // TODO: replace dummy with real component
      meta: {
        title: 'Admin Home', // TODO: import from i18n
        auth: true,
      },
    },
  ].map((route) => {
    route.path = root + route.path; // eslint-disable-line no-param-reassign
    return route;
  });
}
