import { setCookie } from "@/lib/utils/serverFunctions";
import { api } from "./api";
import { API_ROUTES } from "@/features/routes";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("datadata", data.data);
          setCookie([
            { name: "refresh-token", value: data.data.refresh_token },
            { name: "auth-token", value: data.data.token },
          ]);
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),

    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    getUserInfo: build.query({
      query: () => ({
        url: API_ROUTES.getUserInfo,
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetUserInfoQuery } = userApi;
