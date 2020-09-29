// src/access.ts
export default function access(initialState: { currentUser?: SystemEntities.QuiteUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
