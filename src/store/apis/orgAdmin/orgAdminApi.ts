import baseQueryWithAuth from "@/services/baseQueryInstance";
import { createApi } from "@reduxjs/toolkit/query/react";

interface CreateProgramRequest {
  name: string;
  code: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
}

export interface Organization {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
}

export interface CreateProgramResponse {
  id: string;
  created_by: User;
  archived_by: User;
  organization: Organization;
  name: string;
  is_active: boolean;
  created_at: string;
  archived_at: string;
}

export interface PaginatedResponse {
  count: number;
  next: string;
  previous: string;
  results: CreateProgramResponse[];
}

export interface GetOrganizationsParams {
  organization_pk: string;
  page?: number;
  page_size?: number;
}

export interface ArchiveRequest { 
  id:string
}

export const orgAdminApi = createApi({
  reducerPath: "orgAdminApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    createProgram: builder.mutation<
      CreateProgramResponse,
      CreateProgramRequest
    >({
      query: (Data) => {
        return {
          url: "program/programs/create_program/",
          method: "POST",
          body: Data,
        };
      },
    }),
    getAllPrograms: builder.query<
      PaginatedResponse,
      GetOrganizationsParams
    >({
      query: (params) => ({
        url: `program/organizations/${params.organization_pk}/programs/`,
        method: "GET",
        params: {
          organization_pk: params.organization_pk,
          page: params.page,
          page_size: params.page_size,
        },
      }),
    }),
    getAssociatedPrograms: builder.query<
      CreateProgramResponse,
      GetOrganizationsParams
    >({
      query: (params) => ({
        url: `program/organizations/${params.organization_pk}/programs/associated_programs/`,
        method: "GET",
        params: {
          organization_pk: params.organization_pk,
          page: params.page,
          page_size: params.page_size,
        },
      }),
    
    }),

    archiveProgram: builder.mutation<void, ArchiveRequest>({
      query: (data) => {
        return {
          url: `program/programs/${data.id}/archive_program/`,
          method: "POST",
          params: {
            id: data.id,
          }
        };
      },
    }),
    
  }),
});

export const { useCreateProgramMutation, useGetAllProgramsQuery , useGetAssociatedProgramsQuery , useArchiveProgramMutation } = orgAdminApi;
