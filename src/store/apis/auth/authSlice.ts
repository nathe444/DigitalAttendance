import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse } from "./authApi";

interface AuthState {
  user: LoginResponse["staff"] | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload.staff;
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("user", JSON.stringify(action.payload.staff));
      localStorage.setItem("token", action.payload.access_token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
