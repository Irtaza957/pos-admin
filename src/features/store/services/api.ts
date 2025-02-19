import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "@/features/routes";
import { getCookie, removeCookie } from "@/lib/utils/index";
import { setCookie } from "@/lib/utils/serverFunctions";
import router from "next/router";

const baseQuery = fetchBaseQuery({
  baseUrl: API_ROUTES.BASE_URL,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },

  prepareHeaders: (headers, {}) => {
    const token = getCookie("auth-token");
    console.log("token", token);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefresh: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("Token expired, attempting to refresh...");
    const refreshToken = getCookie("refresh-token");
    console.log("refreshToken", refreshToken);
    if (refreshToken) {
      // Attempt to refresh the token
      const refreshResult: any = await baseQuery(
        {
          url: API_ROUTES.REFRESH_TOKEN, // Backend endpoint for refreshing token
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      if (refreshResult?.data) {
        const newAuthToken = refreshResult.data?.data?.token;
        const newRefreshToken = refreshResult.data?.data?.refresh_token;
        console.log("refreshResultrefreshResultrefreshResult", newAuthToken, newRefreshToken);

        setCookie([
          { name: "auth-token", value: newAuthToken },
          { name: "refresh-token", value: newRefreshToken },
        ]);

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // No refresh token, logout the user
        removeCookie("auth-token");
        removeCookie("refresh-token");
        router.push("/login");
      }
    } else {
      // No refresh token, logout the user
      removeCookie("auth-token");
      removeCookie("refresh-token");
      router.push("/login");
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithRefresh,
  keepUnusedDataFor: 5,
  endpoints: () => ({}),
});
