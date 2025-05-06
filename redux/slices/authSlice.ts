import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isRegistered: boolean;
}

const initialState: UserState = {
  isRegistered: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRegistered(state, action: PayloadAction<boolean>) {
      state.isRegistered = action.payload;
    },
  },
});

export const { setRegistered } = userSlice.actions;
export default userSlice.reducer;
