/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import type { QuietRole, QuietUser } from '@/services/system/EntityType';

export default function access(initialState: { currentUser?: QuietUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    ROLE_SystemAdmin: currentUser && hasRole(currentUser.authorities, 'ROLE_SystemAdmin'),
  };
}

function hasRole(roles: QuietRole[], roleName: string) {
  let hasRoleName = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const role of roles) {
    if (role.roleName === roleName) {
      hasRoleName = true;
      break;
    }
  }
  return hasRoleName;
}
