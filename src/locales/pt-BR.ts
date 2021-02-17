import component from '@/locales/pt-BR/component';
import globalHeader from '@/locales/pt-BR/globalHeader';
import menu from '@/locales/pt-BR/menu';
import pwa from '@/locales/pt-BR/pwa';
import settingDrawer from '@/locales/pt-BR/settingDrawer';
import settings from '@/locales/pt-BR/settings';
import dataDictionary from '@/locales/pt-BR/dataDictionary';

export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'ajuda',
  'layout.user.link.privacy': 'política de privacidade',
  'layout.user.link.terms': 'termos de serviços',
  'app.preview.down.block': 'Download this page to your local project',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...dataDictionary,
};
