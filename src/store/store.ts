import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth/authApi";
import authReducer from "./apis/auth/authSlice";
import { staffApi } from "./apis/staff/staffApi";
import { orgSuperAdminApi } from "./apis/orgSuperAdmin/orgSuperAdminApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [orgSuperAdminApi.reducerPath]: orgSuperAdminApi.reducer,
  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(staffApi.middleware)
      .concat(orgSuperAdminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

