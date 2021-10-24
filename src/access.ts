/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import type { QuietRole, QuietUser } from '@/services/system/EntityType';

export default function access(initialState: { current_user?: QuietUser | undefined }) {
  const { current_user } = initialState || {};
  return {
    ROLE_SystemAdmin: current_user && hasRole(current_user.authorities, 'ROLE_SystemAdmin'),
  };
}

function hasRole(roles: QuietRole[], roleName: string) {
  let hasRoleName = false;
  if (!roles) {
    return hasRoleName;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const role of roles) {
    if (role.role_name === roleName) {
      hasRoleName = true;
      break;
    }
  }
  return hasRoleName;
}
