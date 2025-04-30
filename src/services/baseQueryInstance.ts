import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';

const baseUrl = 'https://api.emishopping.com/digital_attendance/api/';

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the Redux store
    const token = (getState() as RootState).auth.accessToken;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include', 
});

export default baseQueryWithAuth;