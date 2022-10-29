import { LocalStorage, UserStatus } from '@/constant/system';

export default function checkLogin() {
  return localStorage.getItem(LocalStorage.UserStatus) === UserStatus.Login;
}
