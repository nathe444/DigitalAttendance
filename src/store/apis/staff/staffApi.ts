import baseQueryWithAuth from "@/services/baseQueryInstance";
import { createApi} from "@reduxjs/toolkit/query/react";

export interface Request {
  email: string;
}
  
export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    assignStaff:builder.mutation<string,Request>({
      query:(staffData)=>{
        return{
          url:"organization/organizations/assign_staff/",
          method:"POST",
          body:staffData
        }
      }
    }),

    assignOrganizationalSuperAdmin:builder.mutation<string,Request>({
      query:(staffData)=>{
        return{
          url:"organization/organizations/assign_organization_super_admin/",
          method:"POST",
          body:staffData
        }
      }
    }),

    revokeOrganizationalSuperAdmin:builder.mutation<string,Request>({
      query:(staffData)=>{
        return{
          url:"organization/organizations/revoke_organization_super_admin/",
          method:"POST",
          body:staffData
        }
      }
    }),

    revokeStaff: builder.mutation<string,Request>({
      query: (staffData) => ({
        url: "organization/organizations/revoke_staff/",
        method: "POST",
        body: staffData,
      }),
  }),
})
});

export const {useAssignStaffMutation ,useRevokeStaffMutation , useAssignOrganizationalSuperAdminMutation, useRevokeOrganizationalSuperAdminMutation } = staffApi;
