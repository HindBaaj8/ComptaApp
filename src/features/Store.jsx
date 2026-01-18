import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { authMiddleware } from './middleware';
import capitauxReducer from './Capitauxslice';
import actifsReducer from './Actifsslice';
import passifsReducer from './Passifsslice';
import chargesReducer from './Chargesslice';
import produitsReducer from './Produitsslice';
import themeReducer from './Themeslice';
import facturesReducer from './Facturesslice';
import authReducer from './Authslice';

export const store = configureStore({
  reducer: {
    capitaux: capitauxReducer,
    actifs: actifsReducer,
    passifs: passifsReducer,
    charges: chargesReducer,
    produits: produitsReducer,
    theme: themeReducer,
    factures: facturesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk, authMiddleware),
});

export default store;
