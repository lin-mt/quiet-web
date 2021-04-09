import component from '@/locales/zh-CN/component';
import globalHeader from '@/locales/zh-CN/globalHeader';
import menu from '@/locales/zh-CN/menu';
import pwa from '@/locales/zh-CN/pwa';
import settingDrawer from '@/locales/zh-CN/settingDrawer';
import settings from '@/locales/zh-CN/settings';
import pages from '@/locales/zh-CN/pages';
import dictionary from '@/locales/zh-CN/dictionary';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...dictionary,
};
