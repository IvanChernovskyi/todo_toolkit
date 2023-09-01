import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setLoading } from './loadingSlice';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos?_limit=10'
      );
      dispatch(setLoading(false));
      return response.data;
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState: [[], [], []],
  reducers: {
    setFetchedTodos: (state, action) => {
      return [action.payload];
    },
  },
});

export const { setFetchedTodos } = todosSlice.actions;
export default todosSlice.reducer;
