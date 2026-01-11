export const authMiddleware = store => next => action => {
  const result = next(action);

  const state = store.getState();

  if (!state.auth.isAuthenticated) {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return result;
};
