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
    path: '/scrum',
    name: 'scrum',
    icon: 'appstore',
    routes: [
      {
        path: '/scrum/project',
        name: 'project',
        component: './scrum/project',
      },
      {
        path: '/scrum/template',
        name: 'template',
        component: './scrum/template',
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
        path: '/system/department',
        name: 'department',
        component: './system/department',
      },
      {
        path: '/system/dataDictionary',
        name: 'data-dictionary',
        component: './system/dataDictionary',
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
