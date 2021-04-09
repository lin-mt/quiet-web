import component from '@/locales/id-ID/component';
import globalHeader from '@/locales/id-ID/globalHeader';
import menu from '@/locales/id-ID/menu';
import pwa from '@/locales/id-ID/pwa';
import settingDrawer from '@/locales/id-ID/settingDrawer';
import settings from '@/locales/id-ID/settings';
import pages from '@/locales/id-ID/pages';
import dictionary from '@/locales/id-ID/dictionary';

export default {
  'navbar.lang': 'Bahasa',
  'layout.user.link.help': 'Bantuan',
  'layout.user.link.privacy': 'Privasi',
  'layout.user.link.terms': 'Ketentuan',
  'app.preview.down.block': 'Unduh halaman ini dalam projek lokal anda',
  'app.welcome.link.fetch-blocks': 'Dapatkan semua blok',
  'app.welcome.link.block-list':
    'Buat standar dengan cepat, halaman-halaman berdasarkan pengembangan `block`',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...dictionary,
};
