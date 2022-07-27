import axiosClient from "axios";
const { NEXT_PUBLIC_URL_PORTAL_PPE_BACKEND } = process.env;

export const axios = axiosClient.create({
  baseURL:  "/",
  // baseURL: NEXT_PUBLIC_URL_PORTAL_PPE_BACKEND || "/",
  timeout: 8000,
  // headers: { "X-Custom-Header": "foobar" },
});
