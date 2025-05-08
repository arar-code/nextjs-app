// next.config.js

module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/auth',
          permanent: false, // Use true for permanent redirect (308), false for temporary (307)
        },
      ];
    },
  };
  