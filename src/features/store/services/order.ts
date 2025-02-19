import { API_ROUTES } from "@/features/routes";
import { api } from "./api";

export const OrderApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchOrder: build.query({
      query: (payload) => {
        // Convert payload to query string
        const queryString = payload && Object.keys(payload).length > 0 ? `?${new URLSearchParams(payload).toString()}` : "";

        return {
          url: API_ROUTES.getOrder + queryString,
          method: "GET",
        };
      },
    }),

    updateOrder: build.mutation({
      query: (payload) => {
        console.log("payload", payload);
        const { id, data, status } = payload;

        return {
          url: `${API_ROUTES.postOrders}/${id}`,
          method: "PATCH",
          body: { ...data, status },
        };
      },
    }),
    updateOrderStatus: build.mutation({
      query: (payload) => {
        console.log("payload", payload);
        const { id, status } = payload;

        return {
          url: `${API_ROUTES.orderStatus}/${id}?status=${status}`,
          method: "PATCH",
        };
      },
    }),
  }),
});

export const { useFetchOrderQuery, useUpdateOrderMutation, useUpdateOrderStatusMutation } = OrderApi;
