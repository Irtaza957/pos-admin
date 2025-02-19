import { API_ROUTES } from "@/features/routes";
import { api } from "./api";

export const productApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchProducts: build.query({
      query: (payload) => {
        const queryString = payload && Object.keys(payload).length > 0 ? `?${new URLSearchParams(payload).toString()}` : "";

        return {
          url: API_ROUTES.getProduct + queryString,
          method: "GET",
        };
      },
    }),
    postproducts: build.mutation({
      query: (payload) => {
        console.log("payload", payload);
        return {
          url: API_ROUTES.postProducts,
          method: "POST",
          body: payload,
        };
      },
    }),

    postProductImage: build.mutation({
      query: (payload) => {
        console.log("payload", payload.get("image"));
        return {
          url: API_ROUTES.postProductImage,
          method: "POST",
          body: payload,
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
        };
      },
    }),

    updateProduct: build.mutation({
      query: (payload) => {
        console.log("payload", payload);
        const { id, data } = payload;
        return {
          url: `${API_ROUTES.postProducts}/${id}`,
          method: "PATCH",
          body: data,
        };
      },
    }),

    deleteProducts: build.mutation({
      query: (productId) => ({
        url: API_ROUTES.deleteProduct + productId,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useFetchProductsQuery, usePostproductsMutation, useDeleteProductsMutation, usePostProductImageMutation, useUpdateProductMutation } = productApi;
