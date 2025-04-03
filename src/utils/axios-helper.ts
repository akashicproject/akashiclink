import axios from 'axios';

const AppConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
};

/** For requests that don't need cookies */
export const axiosBasePublic = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/** For requests that need cookies */
export const axiosOwnerBase = axios.create({
  withCredentials: true,
  baseURL: AppConfig.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});
