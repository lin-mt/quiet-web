import component from '@/locales/en-US/component';
import globalHeader from '@/locales/en-US/globalHeader';
import menu from '@/locales/en-US/menu';
import pwa from '@/locales/en-US/pwa';
import settingDrawer from '@/locales/en-US/settingDrawer';
import settings from '@/locales/en-US/settings';
import pages from '@/locales/en-US/pages';
import dataDictionary from '@/locales/en-US/dataDictionary';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...dataDictionary,
};
