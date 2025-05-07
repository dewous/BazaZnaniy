import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isRegistered: boolean;
  id: string | null;
  group: string | null;
  token: string | null;
}

const initialState: UserState = {
  isRegistered: false,
  id: null,
  group: null,
  token: null
};

interface SetUserDataPayload {
  isRegistered: boolean;
  id: string;
  group: string;
  token: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<SetUserDataPayload>) {
      state.isRegistered = action.payload.isRegistered;
      state.id = action.payload.id;
      state.group = action.payload.group;
      state.token = action.payload.token;
    },
    resetUser(state) {
      state.isRegistered = false;
      state.id = null;
      state.group = null;
      state.token = null;
    },
  },
});

export const { setUserData, resetUser } = userSlice.actions;
export default userSlice.reducer;
