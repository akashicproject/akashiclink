import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import axios from 'axios';

import { getManifestJson } from './hooks/useCurrentAppInfo';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Ap-Client': Capacitor.getPlatform(),
  },
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  try {
    const appInfo = await App.getInfo();
    if (appInfo) {
      config.headers['Ap-Version'] = appInfo.version;
    }
  } catch {
    // App.getInfo() does not work on web. Try manifest
    let version = sessionStorage.getItem('version');
    if (!version) {
      version = (await getManifestJson()).version;
    }
    config.headers['Ap-Version'] = version;
  }

  return config;
});

export const axiosBase = instance;
