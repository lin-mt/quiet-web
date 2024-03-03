/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  if (currentUser?.roles) {
    const administrator = currentUser.roles.find((role) => role.value === 'ROLE_Administrator');
    if (administrator) {
      const handler = {
        get: function () {
          return true;
        },
      };
      return new Proxy({}, handler);
    }
  }
  return {
    hasRoutePermission: (route: string) => {
      return currentUser?.permission?.paths?.find((path) => route.startsWith(path));
    },
  };
}
