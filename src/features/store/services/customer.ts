import { API_ROUTES } from "@/features/routes";
import { api } from "./api";

export const customerApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchCustomers: build.query({
      query: (payload) => {
        const queryString = payload && Object.keys(payload).length > 0 ? `?${new URLSearchParams(payload).toString()}` : "";

        return {
          url: API_ROUTES.getCustomer + queryString,
          method: "GET",
        };
      },
    }),

    postCustomers: build.mutation({
      query: (payload) => {
        console.log("payload", payload);
        return {
          url: API_ROUTES.postCustomer,
          method: "POST",
          body: payload,
        };
      },
    }),

    updateCustomer: build.mutation({
      query: (payload) => {
        console.log("payload", payload);
        const { id, data } = payload;
        return {
          url: API_ROUTES.updateCustomer + id,
          method: "PATCH",
          body: data,
        };
      },
    }),

    updateCustomerStatus: build.mutation({
      query: (payload) => {
        const { id } = payload;
        return {
          url: API_ROUTES.updateCustomerStatus + id,
          method: "PATCH",
        };
      },
    }),

    deleteCustomers: build.mutation({
      query: (customerId) => ({
        url: API_ROUTES.deleteCustomer + customerId,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useFetchCustomersQuery, usePostCustomersMutation, useDeleteCustomersMutation, useUpdateCustomerMutation, useUpdateCustomerStatusMutation } = customerApi;
