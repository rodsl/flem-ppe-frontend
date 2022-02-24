// module.exports = {
//   reactStrictMode: true,
// }
module.exports = (phase) => {
  return {
    async redirects() {
      return [
        {
          source: "/:entity",
          destination: "/:entity/dashboard",
          permanent: true,
        },
        {
          source: "/",
          destination: "/dashboard",
          permanent: true,
        },
      ];
    },
    reactStrictMode: false
  };
};
