
export const authMiddleware = store => next => action => {
  const result = next(action); 

  const state = store.getState(); 

  if (!state.auth.isAuthenticated) {

    const protectedPaths = ['/dashboard', '/actifs', '/passifs', '/charges', '/produits', '/factures'];
    if (protectedPaths.includes(window.location.pathname)) {
      window.location.href = '/login';
    }
  }
  return result;
};
