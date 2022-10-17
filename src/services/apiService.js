import axiosClient from "axios";

export const axios = axiosClient.create({
  // baseURL: "/",
  baseURL: process.env.NEXT_URL_PORTAL_PPE_BACKEND,
  timeout: 30000,
  // headers: { "X-Custom-Header": "foobar" },
});

export const filesAPIService = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/api/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  timeout: 30000,
});

export const filesAPIUpload = axiosClient.create({
  // baseURL: `https://fileupload.beta.flem.org.br/api/Portal_PPE/`,
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/api/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000,
});

export const mailService = axiosClient.create({
  baseURL: `${process.env.NEXT_API_MAIL_SENDER}/api/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  timeout: 30000,
});

export const bdRhService = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BD_DOMINIO}/api`,
  timeout: 30000,
});
