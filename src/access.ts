// src/access.ts
export default function access(initialState: {
  currentUser?: SystemEntities.QuietUser | undefined;
}) {
  const { currentUser } = initialState || {};
  return {
    ROLE_SystemAdmin: currentUser && hasRole(currentUser.authorities, 'SystemAdmin'),
  };
}

function hasRole(roles: SystemEntities.QuietRole[], roleName: string) {
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
