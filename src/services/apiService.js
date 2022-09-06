import axiosClient from "axios";

export const axios = axiosClient.create({
  baseURL: "/",
  // baseURL: NEXT_PUBLIC_URL_PORTAL_PPE_BACKEND || "/",
  timeout: 8000,
  // headers: { "X-Custom-Header": "foobar" },
});

export const filesAPIService = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/api/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
});

export const filesAPIUpload = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/api/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
