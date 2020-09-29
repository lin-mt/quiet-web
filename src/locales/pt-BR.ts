import component from './pt-BR/component';
import globalHeader from './pt-BR/globalHeader';
import menu from './pt-BR/menu';
import pwa from './pt-BR/pwa';
import settingDrawer from './pt-BR/settingDrawer';
import settings from './pt-BR/settings';

export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'ajuda',
  'layout.user.link.privacy': 'política de privacidade',
  'layout.user.link.terms': 'termos de serviços',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
