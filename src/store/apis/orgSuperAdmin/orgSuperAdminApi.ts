import baseQueryWithAuth from "@/services/baseQueryInstance";
import { createApi} from "@reduxjs/toolkit/query/react";

interface CreateOrganizationRequest {
  name:string,
  code:string
}

interface CreateOrganizationResponse {
  id:string,
  name:string,
  code:string,
  is_archived:boolean
}

interface ViewOrganizationsResponse {
  count: number;
  next: string;
  previous: string;
  results: Organization[];
}

interface Organization{
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;     
  archived_at: string;    
  created_by: string;
  archived_by: string;
}

interface UserInfo {
  id: string;
  email: string;
  phone: string;
  name: string;
}

interface UserOrganization{
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
  archived_at: string;
  created_by: UserInfo;
  archived_by: UserInfo;
}

interface ViewUserOrganizationsResponse {
  count: number;
  next: string;
  previous: string; 
  results:UserOrganization[]
}

interface GetUserOrganizationsParams {
  id: string; 
  email: string;
  page?: number;
  page_size?: number;
}

export const orgSuperAdminApi = createApi({
  reducerPath: "orgSuperAdminApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    createOrganization:builder.mutation<CreateOrganizationResponse,CreateOrganizationRequest>({
      query:(orgData)=>{
        return{
          url:"organization/organizations/create_organization/",
          method:"POST",
          body:orgData
        }
      }
    }),
   viewAllOrgainizations: builder.query<ViewOrganizationsResponse , void>({
      query: () => "organization/organizations/view_all_organizations/"
   }),
   viewActiveOrgainizations: builder.query<ViewOrganizationsResponse , void>({
    query: () => "organization/organizations/view_active_organizations/"
   }),
   viewArchivedOrgainizations: builder.query<ViewOrganizationsResponse , void>({
    query: () => "organization/organizations/view_archived_organizations/"
   }),
   getUserOrganizations: builder.query<ViewUserOrganizationsResponse, GetUserOrganizationsParams>({
    query: (params) => ({
      url: `organization/organizations/${params.id}/get_user_organizations/`,
      method: 'GET',
      params: {
        email: params.email,
        page: params.page,
        page_size: params.page_size
      }
    })
   })
})
});

export const { 
  useCreateOrganizationMutation,
  useViewAllOrgainizationsQuery,
  useViewActiveOrgainizationsQuery,
  useViewArchivedOrgainizationsQuery,
  useGetUserOrganizationsQuery
} = orgSuperAdminApi;
