// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              name: 'login',
              path: '/user/login',
              component: './Login',
            },
          ],
        },
        {
          path: '/main',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/main',
              redirect: '/main/home',
            },
            {
              path: '/main/home',
              component: './Home'
            },
            {
              name: 'list.table-list',
              icon: 'table',
              path: '/main/list',
              component: './ListTableList',
            },
            {
              component: './404',
            },
          ]
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[APP_ENV || 'dev'],
  define: {
    APP_ENV: APP_ENV || '',
  },
  manifest: {
    basePath: '/',
  },
});
