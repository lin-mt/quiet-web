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
    path: '/system',
    name: 'system',
    icon: 'setting',
    access: 'SystemAdmin',
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
        path: '/system/department',
        name: 'department',
        component: './system/department',
      },
      {
        path: '/system/team',
        name: 'team',
        component: './system/team',
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
