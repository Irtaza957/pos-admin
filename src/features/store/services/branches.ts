import { API_ROUTES } from "@/features/routes";
import { api } from "./api";

export const storeApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchStores: build.query({
      query: (payload) => {
        const queryString = payload && Object.keys(payload).length > 0 ? `?${new URLSearchParams(payload).toString()}` : "";

        return {
          url: API_ROUTES.getStore + queryString,
          method: "GET",
        };
      },
    }),
    fetchBranchEmployees: build.query({
      query: (payload) => {
        return {
          url: API_ROUTES.getBranchEmployees + payload.id,
          method: "GET",
        };
      },
    }),
    addBranch: build.mutation({
      query: (payload) => {
        return {
          url: API_ROUTES.addBranch,
          method: "POST",
          body: payload,
        };
      },
    }),
    fetchEmployees: build.query({
      query: () => {
        return {
          url: API_ROUTES.getEmployees,
          method: "GET",
        };
      },
    }),
    addEmployee: build.mutation({
      query: (payload) => {
        return {
          url: API_ROUTES.addEmployee,
          method: "POST",
          body: payload,
        };
      },
    }),
    updateEmployee: build.mutation({
      query: (payload) => {
        const { id, ...data } = payload;
        return {
          url: API_ROUTES.addEmployee + id,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteEmployee: build.mutation({
      query: (payload) => {
        return {
          url: API_ROUTES.addEmployee + payload.id,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useFetchStoresQuery,
  useFetchBranchEmployeesQuery,
  useAddBranchMutation,
  useFetchEmployeesQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = storeApi;
