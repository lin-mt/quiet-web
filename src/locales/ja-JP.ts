import globalHeader from '@/locales/ja-JP/globalHeader';
import menu from '@/locales/ja-JP/menu';
import settingDrawer from '@/locales/ja-JP/settingDrawer';
import settings from '@/locales/ja-JP/settings';
import pwa from '@/locales/ja-JP/pwa';
import component from '@/locales/ja-JP/component';
import pages from '@/locales/ja-JP/pages';
import dictionary from '@/locales/ja-JP/dictionary';

export default {
  'navBar.lang': '言語',
  'layout.user.link.help': 'ヘルプ',
  'layout.user.link.privacy': 'プライバシー',
  'layout.user.link.terms': '利用規約',
  'app.preview.down.block': 'このページをローカルプロジェクトにダウンロードしてください',
  'app.welcome.link.fetch-blocks': '',
  'app.welcome.link.block-list': '',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...dictionary,
};
