import { API_ROUTES } from "@/features/routes";
import { api } from "./api";

export const subCategoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchSubCategories: build.query({
      query: (payload) => {
        // Convert payload to query string
        const queryString = payload && Object.keys(payload).length > 0 ? `?${new URLSearchParams(payload).toString()}` : "";

        return {
          url: API_ROUTES.getSubCategory + queryString,
          method: "GET",
        };
      },
    }),

    postSubCategories: build.mutation({
      query: (payload) => {
        console.log("payload", payload);
        return {
          url: API_ROUTES.postSubCategory,
          method: "POST",
          body: payload,
        };
      },
    }),

    updateSubCategories: build.mutation({
      query: (payload) => {
        const { id, body } = payload;
        return {
          url: API_ROUTES.postSubCategory + `/${id}`,
          method: "PATCH",
          body: body,
        };
      },
    }),

    deleteSubCategories: build.mutation({
      query: (subCategoryId) => ({
        url: API_ROUTES.deleteSubCategory + subCategoryId,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useFetchSubCategoriesQuery, usePostSubCategoriesMutation, useDeleteSubCategoriesMutation, useUpdateSubCategoriesMutation } = subCategoryApi;
