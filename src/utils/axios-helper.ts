import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Ap-Client': Capacitor.getPlatform(),
  },
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  const appInfo = await App.getInfo();
  if (appInfo) {
    config.headers['Ap-Version'] = appInfo.version;
  }
  return config;
});

export const axiosBase = instance;
