import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth/authApi";
import authReducer from "./apis/auth/authSlice";
import { staffApi } from "./apis/staff/staffApi";
import { orgSuperAdminApi } from "./apis/orgSuperAdmin/orgSuperAdminApi";
import { orgAdminApi } from "./apis/orgAdmin/orgAdminApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [orgSuperAdminApi.reducerPath]: orgSuperAdminApi.reducer,
    [orgAdminApi.reducerPath]: orgAdminApi.reducer,
  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(staffApi.middleware)
      .concat(orgSuperAdminApi.middleware)
      .concat(orgAdminApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

