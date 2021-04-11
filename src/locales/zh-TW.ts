import component from '@/locales/zh-TW/component';
import globalHeader from '@/locales/zh-TW/globalHeader';
import menu from '@/locales/zh-TW/menu';
import pwa from '@/locales/zh-TW/pwa';
import settingDrawer from '@/locales/zh-TW/settingDrawer';
import settings from '@/locales/zh-TW/settings';
import dictionary from '@/locales/zh-TW/dictionary';

export default {
  'navBar.lang': '語言',
  'layout.user.link.help': '幫助',
  'layout.user.link.privacy': '隱私',
  'layout.user.link.terms': '條款',
  'app.preview.down.block': '下載此頁面到本地項目',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...dictionary,
};
