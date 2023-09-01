import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: false,
  reducers: {
    setModal: (state, action) => {
      return action.payload;
    },
  },
});

export const { setModal } = modalSlice.actions;
export default modalSlice.reducer;
