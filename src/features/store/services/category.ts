import { API_ROUTES } from "@/features/routes";
import { api } from "./api";

export const categoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchCategories: build.query({
      query: (payload) => {
        // Convert payload to query string
        const queryString = payload && Object.keys(payload).length > 0 ? `?${new URLSearchParams(payload).toString()}` : "";

        return {
          url: API_ROUTES.getCategory + queryString,
          method: "GET",
        };
      },
    }),

    postCategories: build.mutation({
      query: (payload) => {
        console.log("payload", payload);
        return {
          url: API_ROUTES.postCategory,
          method: "POST",
          body: payload,
        };
      },
    }),

    updateCategories: build.mutation({
      query: (payload) => {
        const { id, body } = payload;
        return {
          url: API_ROUTES.postCategory + `/${id}`,
          method: "PATCH",
          body: body,
        };
      },
    }),

    deleteCategories: build.mutation({
      query: (categoryId) => ({
        url: API_ROUTES.deleteCategory + categoryId,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useFetchCategoriesQuery, usePostCategoriesMutation, useDeleteCategoriesMutation, useUpdateCategoriesMutation } = categoryApi;
