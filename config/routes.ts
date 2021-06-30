export default [
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
    path: '/doc',
    name: 'doc',
    icon: 'file-text',
    routes: [
      {
        path: '/doc/project',
        name: 'project',
        component: './doc/project',
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    icon: 'setting',
    access: 'ROLE_SystemAdmin',
    routes: [
      {
        path: '/system/client',
        name: 'client',
        component: './system/client',
      },
      {
        path: '/system/route',
        name: 'gateway-route',
        component: './system/route',
      },
      {
        path: '/system/department',
        name: 'department',
        component: './system/department',
      },
      {
        path: '/system/dictionary',
        name: 'dictionary',
        component: './system/dictionary',
      },
      {
        path: '/system/permission',
        name: 'permission',
        component: './system/permission',
      },
      {
        path: '/system/role',
        name: 'role',
        component: './system/role',
      },
      {
        path: '/system/team',
        name: 'team',
        component: './system/team',
      },
      {
        path: '/system/userinfo',
        name: 'userinfo',
        component: './system/userinfo',
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
];
