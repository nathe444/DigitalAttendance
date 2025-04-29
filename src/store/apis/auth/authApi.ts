import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "./authSlice";

export interface LoginResponse {
  access_token: string;
  refreshToken:string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

 export interface RegistrationRequest {
  email: string;                 
  phone: string;                
  name: string;                  
  signature_base64: string;     
  signature_stroke: string;   
  }
  
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.emishopping.com/digital_attendance/api/",
  }),
  endpoints: (builder) => ({
    register:builder.mutation<void,RegistrationRequest>({
      query:(credentials)=>{
        return{
          url:"/account/users/",
          method:"POST",
          body:credentials
        }
      }
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // localStorage.setItem("token", data.access_token);
          // localStorage.setItem("refreshToken", data.refreshToken);
          dispatch(setUser(data));
        } catch (error) {
          console.error("Login failed", error);
        }
      },
    }),
  }),
});

export const {useRegisterMutation, useLoginMutation} = authApi;
