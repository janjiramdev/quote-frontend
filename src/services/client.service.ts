import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import mainConfig from '../configs/main.config';
import { getAccessToken, removeAccessToken } from '../utils/cookie.util';

const client = axios.create({
  baseURL: mainConfig.services.endpoint,
  timeout: 60000,
  withCredentials: true,
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Content-Type'] = 'application/json';
    const accessToken = getAccessToken();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error.response?.data ?? error),
);

client.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeAccessToken();
      window.location.href = '/signin';

      return Promise.reject(error.response?.data ?? error);
    }

    return Promise.reject(error.response?.data ?? error);
  },
);

export default client;
