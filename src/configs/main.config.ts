export default {
  services: {
    endpoint: import.meta.env.VITE_SERVICE_ENDPOINT,
  },
  cookies: {
    accessTokenExpireTime: import.meta.env.VITE_COOKIE_ACCESS_TOKEN_EXPIRE_TIME,
  },
};
