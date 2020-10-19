// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Quite',
    locale: true,
    siderWidth: 208,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
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
      path: '/login',
      name: 'login',
      layout: false,
      component: './login',
      hideInMenu: true,
    },
    {
      path: '/index',
      name: 'index',
      component: './index',
      hideInMenu: true,
    },
    {
      path: '/system',
      name: 'system',
      icon: 'setting',
      routes: [
        {
          path: '/system/userinfo',
          name: 'userinfo',
          component: './system/userinfo',
        },
        {
          path: '/system/role',
          name: 'role',
          component: './system/role',
        },
        {
          path: '/system/permission',
          name: 'permission',
          component: './system/permission',
        },
        {
          path: '/system/setting',
          name: 'setting',
          component: './system/setting',
        },
        {
          path: '/system/info',
          name: 'info',
          component: './system/info',
        },
      ],
    },
    {
      path: '/',
      redirect: '/index',
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
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
