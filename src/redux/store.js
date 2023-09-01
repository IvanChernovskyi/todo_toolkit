// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import loadingReducer from './loadingSlice';
import modalReducer from './modalSlice';

const store = configureStore({
  reducer: {
    todos: todosReducer,
    loading: loadingReducer,
    modal: modalReducer,
  },
});

export default store;
